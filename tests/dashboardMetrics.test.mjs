import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateDashboardMetrics } from '../src/admin/dashboardMetrics.js'

test('calcula los KPI reales de solicitudes y la conversión', () => {
  const now = new Date('2026-10-21T15:00:00Z')
  const requests = [
    { status: 'not_contacted', read_at: null, campus: 'Sede Trujillo', grade: 'Primaria', created_at: '2026-10-01T10:00:00Z', follow_up_at: null },
    { status: 'to_contact', read_at: '2026-10-02T10:00:00Z', campus: 'Sede Trujillo', grade: 'Inicial', created_at: '2026-10-02T10:00:00Z', follow_up_at: '2026-10-15T10:00:00Z' },
    { status: 'contacted', read_at: '2026-09-10T10:00:00Z', campus: 'Sede Cedeño', grade: 'Primaria', created_at: '2026-09-10T10:00:00Z', follow_up_at: null },
    { status: 'new_client', read_at: '2026-08-10T10:00:00Z', campus: 'Sede Trujillo', grade: 'Secundaria', created_at: '2026-08-10T10:00:00Z', follow_up_at: null },
  ]
  const result = calculateDashboardMetrics(requests, now)
  assert.equal(result.total, 4)
  assert.equal(result.unread, 1)
  assert.equal(result.thisMonth, 2)
  assert.equal(result.pending, 2)
  assert.equal(result.overdue, 1)
  assert.equal(result.newClients, 1)
  assert.equal(result.contacted, 2)
  assert.equal(result.conversionRate, 25)
  assert.equal(result.campusCounts['Sede Trujillo'], 3)
})

test('devuelve indicadores en cero cuando aún no hay solicitudes', () => {
  const result = calculateDashboardMetrics([], new Date('2026-10-21T15:00:00Z'))
  assert.equal(result.total, 0)
  assert.equal(result.conversionRate, 0)
  assert.equal(result.months.length, 6)
})
