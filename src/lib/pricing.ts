export const isActiveDeal = (
  deal: { startsAt?: string | null; endsAt?: string | null },
  now: Date,
): boolean => {
  if (deal.startsAt && new Date(deal.startsAt) > now) return false
  if (!deal.endsAt) return true
  const end = new Date(deal.endsAt)
  end.setUTCHours(23, 59, 59, 999)
  return end >= now
}

export const formatDate = (value: string | null | undefined): string => {
  if (!value) return ''
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}
