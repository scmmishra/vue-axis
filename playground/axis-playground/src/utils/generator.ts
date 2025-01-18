export function generateNumbers(length: number, min: number, max: number) {
  return Array.from(
    { length },
    () => Math.floor(Math.random() * (max - min + 1)) + min,
  )
}

const granularityMap = {
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  year: 365 * 24 * 60 * 60 * 1000,
}

export function generateDates(
  length: number,
  granularity: 'day' | 'week' | 'month' | 'year' = 'day',
) {
  const now = Date.now()

  return Array.from({ length }, (_, i) => {
    const date = new Date(now - i * granularityMap[granularity])
    switch (granularity) {
      case 'week':
        date.setDate(date.getDate() - date.getDay())
        break
      case 'month':
        date.setDate(1)
        break
      case 'year':
        date.setMonth(0, 1)
        break
    }

    return date
  })
}
