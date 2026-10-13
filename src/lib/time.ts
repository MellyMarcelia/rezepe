const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'long' })

const STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 86_400_000],
  ['month', 30 * 86_400_000],
  ['week', 7 * 86_400_000],
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
]

export function timeAgo(at: number, now = Date.now()) {
  const diff = at - now
  for (const [unit, ms] of STEPS) {
    if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit)
  }
  return 'just now'
}

export function heritageLabel(sinceYear?: number) {
  if (!sinceYear) return ''
  const years = new Date().getFullYear() - sinceYear
  return years > 0 ? `In the family for ${years} years` : 'New to the family'
}

/** "Mom" + "Mom's Chicken Nuggets" → "Mom's Chicken Nuggets", not "Mom's Mom's Chicken Nuggets". */
export function ownedTitle(ownerName: string | undefined, title: string) {
  if (!ownerName || title.toLowerCase().startsWith(ownerName.toLowerCase())) return title
  if (ownerName.toLowerCase() === 'your') return `${ownerName} ${title}`
  return `${ownerName}’s ${title}`
}
