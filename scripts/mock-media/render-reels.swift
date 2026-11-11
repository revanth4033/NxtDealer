// Renders placeholder AI reel videos (9:16 H.264 MP4) and poster frames for the mock data layer.
// Each reel animates the photos of one vehicle photo set with pan/zoom moves and crossfades, standing in
// for the reels dealers generate from vehicle photos in the NxtDealer app.
//
// Input:  scripts/mock-media/reel-sets.json  ([{ key, photos: ["/mock-media/vehicles/…jpg", …] }])
// Output: public/mock-media/reels/{key}.mp4 and {key}.jpg (poster)
// Run:    swift scripts/mock-media/render-reels.swift "$PWD"

import AppKit
import AVFoundation

let root = URL(fileURLWithPath: CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : FileManager.default.currentDirectoryPath)
let publicDir = root.appendingPathComponent("public")
let outDir = publicDir.appendingPathComponent("mock-media/reels")
try FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

struct ReelSet: Decodable { let key: String; let photos: [String] }
let sets = try JSONDecoder().decode([ReelSet].self, from: Data(contentsOf: root.appendingPathComponent("scripts/mock-media/reel-sets.json")))

let width = 360
let height = 640
let fps: Int32 = 24
let durationSeconds = 6.0
let segmentCount = 3
let segmentSeconds = durationSeconds / Double(segmentCount)
let crossfadeSeconds = 0.4

func loadImage(_ path: String) -> CGImage {
    let url = publicDir.appendingPathComponent(String(path.dropFirst()))
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else { fatalError("Cannot load \(url.path)") }
    return image
}

func easeInOut(_ t: Double) -> Double { t < 0.5 ? 2 * t * t : 1 - pow(-2 * t + 2, 2) / 2 }

/// Full-height cover crop of a 4:3 photo, panned horizontally.
func panRect(scale: Double, from: Double, to: Double, progress p: Double) -> CGRect {
    let h = Double(height) * scale, w = h * 4 / 3
    let x = -(w - Double(width)) * (from + (to - from) * easeInOut(p))
    return CGRect(x: x, y: -(h - Double(height)) * 0.5, width: w, height: h)
}

/// Final shot: both photos stacked (front view over rear view), each filling half the frame.
/// The whole 9:16 frame shows the vehicle, with only a small slice cropped from the photo sides.
func drawSplit(_ context: CGContext, _ images: [CGImage], progress p: Double) {
    let half = Double(height) / 2
    let scale = 1.08 - 0.08 * easeInOut(p)
    for (index, image) in images.prefix(2).enumerated() {
        // CoreGraphics origin is bottom-left: the first photo takes the top half.
        let band = CGRect(x: 0, y: index == 0 ? half : 0, width: Double(width), height: half)
        let h = half * scale, w = h * 4 / 3
        context.saveGState()
        context.clip(to: band)
        context.draw(image, in: CGRect(x: (Double(width) - w) / 2, y: band.minY + (half - h) / 2, width: w, height: h))
        context.restoreGState()
    }
    context.setFillColor(CGColor(gray: 1, alpha: 0.9))
    context.fill(CGRect(x: 0, y: half - 1.5, width: Double(width), height: 3))
}

func drawShot(_ context: CGContext, _ images: [CGImage], segment: Int, progress: Double, alpha: Double) {
    context.saveGState()
    context.setAlpha(CGFloat(alpha))
    switch segment {
    case 0: context.draw(images[0], in: panRect(scale: 1.0, from: 0.15, to: 0.85, progress: progress))
    case 1: context.draw(images[1], in: panRect(scale: 1.1, from: 0.75, to: 0.3, progress: progress))
    default: drawSplit(context, images, progress: progress)
    }
    context.restoreGState()
}

func drawFrame(_ context: CGContext, shots: [CGImage], time t: Double) {
    context.interpolationQuality = .high
    let segment = min(Int(t / segmentSeconds), segmentCount - 1)
    let intoSegment = t - Double(segment) * segmentSeconds
    drawShot(context, shots, segment: segment, progress: intoSegment / segmentSeconds, alpha: 1)
    let fadeStart = segmentSeconds - crossfadeSeconds
    if segment < segmentCount - 1, intoSegment > fadeStart {
        drawShot(context, shots, segment: segment + 1, progress: 0, alpha: (intoSegment - fadeStart) / crossfadeSeconds)
    }
}

func render(_ set: ReelSet) throws {
    let images = set.photos.map(loadImage)
    let shots = images

    let videoURL = outDir.appendingPathComponent("\(set.key).mp4")
    try? FileManager.default.removeItem(at: videoURL)
    let writer = try AVAssetWriter(outputURL: videoURL, fileType: .mp4)
    writer.shouldOptimizeForNetworkUse = true
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: width,
        AVVideoHeightKey: height,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: 420_000,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264MainAutoLevel,
            AVVideoMaxKeyFrameIntervalKey: Int(fps) * 2,
        ],
    ])
    input.expectsMediaDataInRealTime = false
    let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB,
        kCVPixelBufferWidthKey as String: width,
        kCVPixelBufferHeightKey as String: height,
    ])
    writer.add(input)
    writer.startWriting()
    writer.startSession(atSourceTime: .zero)

    let frameCount = Int(durationSeconds * Double(fps))
    for frame in 0..<frameCount {
        while !input.isReadyForMoreMediaData { usleep(2_000) }
        guard let pool = adaptor.pixelBufferPool else { fatalError("No pixel buffer pool") }
        var buffer: CVPixelBuffer?
        CVPixelBufferPoolCreatePixelBuffer(nil, pool, &buffer)
        guard let pixelBuffer = buffer else { fatalError("No pixel buffer") }
        CVPixelBufferLockBaseAddress(pixelBuffer, [])
        let context = CGContext(
            data: CVPixelBufferGetBaseAddress(pixelBuffer), width: width, height: height,
            bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pixelBuffer),
            space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue
        )!
        drawFrame(context, shots: shots, time: Double(frame) / Double(fps))
        if frame == frameCount - 3, let image = context.makeImage() {
            // Poster: the final split framing, so the thumbnail shows the vehicle edge to edge.
            let jpeg = NSBitmapImageRep(cgImage: image).representation(using: .jpeg, properties: [.compressionFactor: 0.8])
            try jpeg?.write(to: outDir.appendingPathComponent("\(set.key).jpg"))
        }
        CVPixelBufferUnlockBaseAddress(pixelBuffer, [])
        adaptor.append(pixelBuffer, withPresentationTime: CMTime(value: CMTimeValue(frame), timescale: fps))
    }
    input.markAsFinished()
    let done = DispatchSemaphore(value: 0)
    writer.finishWriting { done.signal() }
    done.wait()
    if writer.status != .completed { fatalError("Writing \(set.key) failed: \(String(describing: writer.error))") }
    print("Rendered \(set.key)")
}

for set in sets { try render(set) }
