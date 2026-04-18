import { CSSProperties, useId } from 'react'

type LogoVariant = 'light' | 'dark'
type LogoSize = 'sm' | 'md' | 'lg'

const LOGO_WIDTH: Record<LogoSize, number> = {
  sm: 118,
  md: 148,
  lg: 188,
}

const LOGO_HEIGHT: Record<LogoSize, number> = {
  sm: 22,
  md: 28,
  lg: 36,
}

const MARK_SIZE: Record<LogoSize, number> = {
  sm: 16,
  md: 20,
  lg: 28,
}

export function Logo({
  variant = 'light',
  size = 'md',
  style,
  className,
}: {
  variant?: LogoVariant
  size?: LogoSize
  style?: CSSProperties
  className?: string
}) {
  const gradientId = useId().replace(/:/g, '')
  const wordStart = variant === 'light' ? '#0F766E' : '#FFFFFF'

  return (
    <svg
      className={className}
      style={{ display: 'block', width: LOGO_WIDTH[size], height: LOGO_HEIGHT[size], ...style }}
      viewBox="0 0 296 56"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Locatalyze"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F766E" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <g transform="translate(4,4)">
        <path
          d="M 24.00,1.00 L 25.34,12.08 L 29.12,1.58 L 27.96,12.67 L 33.98,3.28 L 30.38,13.84 L 38.34,6.02 L 32.49,15.51 L 41.98,9.66 L 34.16,17.62 L 44.72,14.02 L 35.33,20.04 L 46.42,18.88 L 35.92,22.66 L 47.00,24.00 L 35.92,25.34 L 46.42,29.12 L 35.33,27.96 L 44.72,33.98 L 34.16,30.38 L 41.98,38.34 L 32.49,32.49 L 38.34,41.98 L 30.38,34.16 L 33.98,44.72 L 27.96,35.33 L 29.12,46.42 L 25.34,35.92 L 24.00,47.00 L 22.66,35.92 L 18.88,46.42 L 20.04,35.33 L 14.02,44.72 L 17.62,34.16 L 9.66,41.98 L 15.51,32.49 L 6.02,38.34 L 13.84,30.38 L 3.28,33.98 L 12.67,27.96 L 1.58,29.12 L 12.08,25.34 L 1.00,24.00 L 12.08,22.66 L 1.58,18.88 L 12.67,20.04 L 3.28,14.02 L 13.84,17.62 L 6.02,9.66 L 15.51,15.51 L 9.66,6.02 L 17.62,13.84 L 14.02,3.28 L 20.04,12.67 L 18.88,1.58 L 22.66,12.08 Z"
          fill={`url(#${gradientId})`}
        />
      </g>
      <text
        x="60"
        y="37"
        fontFamily="DM Sans, Helvetica Neue, Arial, sans-serif"
        fontSize="26"
        fontWeight="800"
        letterSpacing="-0.04em"
      >
        <tspan fill={wordStart}>Loca</tspan>
        <tspan fill="#14B8A6">talyze</tspan>
      </text>
    </svg>
  )
}

export function LogoMark({
  size = 'md',
  style,
  className,
}: {
  size?: LogoSize
  style?: CSSProperties
  className?: string
}) {
  return (
    <svg
      className={className}
      style={{ display: 'block', width: MARK_SIZE[size], height: MARK_SIZE[size], ...style }}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M13 2C13 2 5.5 9 5.5 14.2C5.5 18.5 8.8 22 13 22C17.2 22 20.5 18.5 20.5 14.2C20.5 9 13 2 13 2Z"
        fill="white"
        opacity="0.95"
      />
      <circle cx="13" cy="14.5" r="4" fill="rgba(0,0,0,0.22)" />
    </svg>
  )
}
