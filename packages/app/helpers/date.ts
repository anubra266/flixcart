import { ItemType } from 'app/helpers/constants'

export function isAfterToday(date: Date) {
  const today = new Date()

  today.setHours(23, 59, 59, 998)

  return date > today
}

export function transformDate(date: string | Date, type: ItemType) {
  const dateObj = new Date(date)
  const intlDate = new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    weekday: 'long',
  }).format(dateObj)

  const isFuture = isAfterToday(dateObj)
  const period = {
    [ItemType.MOVIE]: isFuture ? 'Releases' : 'Released',
    [ItemType.SHOW]: isFuture ? 'Airs' : 'Aired',
  }

  return [period[type], intlDate]
}

export function toHoursAndMinutes(min: string | number) {
  const totalMinutes = typeof min === 'number' ? min : parseInt(min)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
}
