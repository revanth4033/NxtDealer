import { CarFront } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

interface VehicleImageProps {
  src: string | undefined
  alt: string
  className?: string
  /** Smaller fallback treatment for table thumbnails. */
  compact?: boolean
}

/** Vehicle photo with a neutral fallback when the dealer hasn't uploaded one (or it fails to load). */
export function VehicleImage({ src, alt, className, compact = false }: VehicleImageProps) {
  const [failedSrc, setFailedSrc] = useState<string>()
  const showFallback = !src || failedSrc === src

  if (showFallback) {
    return (
      <div
        role="img"
        aria-label={`${alt} (no photo)`}
        className={cn('flex flex-col items-center justify-center gap-1 bg-muted text-muted-foreground', className)}
      >
        <CarFront aria-hidden className={compact ? 'size-4' : 'size-6'} strokeWidth={1.5} />
        {!compact && <span className="text-caption">No photo yet</span>}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={cn('bg-muted object-cover', className)}
    />
  )
}
