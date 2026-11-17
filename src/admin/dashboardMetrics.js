import { admissionStatuses } from '../cms/admissionConstants.js'

const monthKey = (value) => {
  const date = new Date(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function calculateDashboardMetrics(requests, now = new Date()) {
  const currentMonth = monthKey(now)
  const statusCounts = Object.fromEntries(admissionStatuses.map(({ value }) => [value, 0]))
  const campusCounts = {}
  const gradeCounts = {}
  const monthCounts = {}

  requests.forEach((request) => {
    statusCounts[request.status] = (statusCounts[request.status] || 0) + 1
    campusCounts[request.campus] = (campusCounts[request.campus] || 0) + 1
    gradeCounts[request.grade] = (gradeCounts[request.grade] || 0) + 1
    const key = monthKey(request.created_at)
    monthCounts[key] = (monthCounts[key] || 0) + 1
  })

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    const key = monthKey(date)
    return { key, label: new Intl.DateTimeFormat('es-PE', { month: 'short' }).format(date).replace('.', ''), value: monthCounts[key] || 0 }
  })
  const total = requests.length
  const newClients = statusCounts.new_client || 0
  const overdue = requests.filter((request) => request.follow_up_at && new Date(request.follow_up_at) < now && !['new_client', 'not_interested'].includes(request.status)).length

  return {
    total,
    unread: requests.filter((request) => !request.read_at).length,
    thisMonth: requests.filter((request) => monthKey(request.created_at) === currentMonth).length,
    contacted: (statusCounts.contacted || 0) + newClients,
    newClients,
    conversionRate: total ? Math.round((newClients / total) * 1000) / 10 : 0,
    pending: (statusCounts.not_contacted || 0) + (statusCounts.to_contact || 0),
    overdue,
    statusCounts,
    campusCounts,
    gradeCounts,
    months,
  }
}
