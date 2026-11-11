import { useId } from 'react'

import { cn } from '@/lib/utils'

interface SparklineProps {
  values: number[]
  className?: string
  /** Accessible summary, e.g. "Trending up over the last 12 weeks". Omit to hide from assistive tech. */
  label?: string
}

const WIDTH = 96
const HEIGHT = 32
const PADDING = 2

/** Minimal inline trend line. Uses currentColor so the parent controls its colour. */
export function Sparkline({ values, className, label }: SparklineProps) {
  const gradientId = useId()
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const points = values.map((value, index) => {
    const x = PADDING + (index / (values.length - 1)) * (WIDTH - PADDING * 2)
    const y = HEIGHT - PADDING - ((value - min) / range) * (HEIGHT - PADDING * 2)
    return [x, y] as const
  })
  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${PADDING},${HEIGHT} ${line} ${WIDTH - PADDING},${HEIGHT}`
  const [lastX, lastY] = points[points.length - 1]

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={cn('h-8 w-24 overflow-visible', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.14" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradientId})`} />
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r="2.25" fill="currentColor" />
    </svg>
  )
}
