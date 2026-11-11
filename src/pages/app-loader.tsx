import { BrandMark } from '@/components/common/brand-mark'

/** Shown while the router resolves the first lazy route. */
export function AppLoader() {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas">
      <div className="flex flex-col items-center gap-4">
        <BrandMark />
        <div className="h-0.5 w-24 overflow-hidden rounded-full bg-border">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </div>
  )
}
