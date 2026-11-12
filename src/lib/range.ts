/** An inclusive numeric range; an omitted side is unrestricted. */
export interface NumberRange {
  min?: number
  max?: number
}

/**
 * Parses one range boundary typed by an admin or read from the URL. Blank means "no limit";
 * anything other than a whole number of zero or more is invalid. Digit-group commas are allowed.
 */
export function parseRangeBound(text: string | undefined): number | undefined | 'invalid' {
  const trimmed = text?.trim().replace(/,/g, '') ?? ''
  if (trimmed === '') return undefined
  const value = Number(trimmed)
  return Number.isInteger(value) && value >= 0 ? value : 'invalid'
}

/** Why a range can't be applied, or `undefined` when it can. */
export function getRangeError({ min, max }: NumberRange): string | undefined {
  if (min !== undefined && max !== undefined && min > max) return 'The minimum can’t be more than the maximum.'
  return undefined
}

export const isRangeSet = ({ min, max }: NumberRange) => min !== undefined || max !== undefined
