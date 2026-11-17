import { useCallback, useEffect, useMemo, useState } from 'react'
import { admissionStatuses, listAdmissionRequests, subscribeToAdmissionRequests } from '../cms/admissionService'
import { calculateDashboardMetrics } from './dashboardMetrics'
import useFlash, { FlashMessage } from './useFlash'

const statusLabel = (value) => admissionStatuses.find((status) => status.value === value)?.label || value
const entries = (value) => Object.entries(value).sort((a, b) => b[1] - a[1])
const todayKey = () => new Date().toISOString().slice(0, 10)

function Distribution({ title, data }) {
  const rows = entries(data)
  const max = Math.max(...rows.map(([, value]) => value), 1)
  return <section className="dashboard-panel"><header><h2>{title}</h2><span>{rows.reduce((total, [, value]) => total + value, 0)} registros</span></header><div className="dashboard-bars">{rows.length ? rows.map(([label, value]) => <div key={label}><span title={label}>{label}</span><i><b style={{ width: `${(value / max) * 100}%` }} /></i><strong>{value}</strong></div>) : <p>Sin datos todavía.</p>}</div></section>
}

export default function Dashboard({ onNavigate, onUnreadChange }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [setupRequired, setSetupRequired] = useState(false)
  const { flash, showFlash } = useFlash()
  const load = useCallback(async () => {
    try {
      const data = await listAdmissionRequests()
      setSetupRequired(false)
      setRequests(data)
      onUnreadChange?.(data.filter((request) => !request.read_at).length)
    } catch (error) {
      if (error.code === 'ADMISSION_SETUP_REQUIRED') setSetupRequired(true)
      else showFlash(error.message, 'error')
    } finally { setLoading(false) }
  }, [onUnreadChange, showFlash])
  useEffect(() => { load(); return subscribeToAdmissionRequests(load) }, [load])
  const metrics = useMemo(() => calculateDashboardMetrics(requests), [requests])

  const exportPdf = async () => {
    try {
      const [{ jsPDF }, { autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
      const document = new jsPDF()
      document.setTextColor(18, 41, 92)
      document.setFontSize(20)
      document.text('Reporte general de admisiones', 14, 18)
      document.setFontSize(9)
      document.setTextColor(90, 98, 115)
      document.text(`Paideia College · Generado el ${new Intl.DateTimeFormat('es-PE', { dateStyle: 'long', timeStyle: 'short' }).format(new Date())}`, 14, 25)
      autoTable(document, { startY: 32, head: [['KPI', 'Resultado']], body: [['Solicitudes totales', metrics.total], ['Solicitudes este mes', metrics.thisMonth], ['Sin leer', metrics.unread], ['Pendientes de contacto', metrics.pending], ['Seguimientos vencidos', metrics.overdue], ['Nuevos clientes', metrics.newClients], ['Tasa de conversión', `${metrics.conversionRate}%`]], headStyles: { fillColor: [18, 41, 92] }, alternateRowStyles: { fillColor: [250, 247, 241] } })
      autoTable(document, { startY: document.lastAutoTable.finalY + 8, head: [['Estado', 'Cantidad']], body: admissionStatuses.map((status) => [status.label, metrics.statusCounts[status.value] || 0]), headStyles: { fillColor: [224, 159, 18] } })
      autoTable(document, { startY: document.lastAutoTable.finalY + 8, head: [['Sede', 'Cantidad']], body: entries(metrics.campusCounts), headStyles: { fillColor: [244, 122, 31] } })
      document.save(`reporte-admisiones-paideia-${todayKey()}.pdf`)
      showFlash('Reporte PDF generado.')
    } catch (error) { showFlash(error.message, 'error') }
  }

  const exportExcel = async () => {
    try {
      const { default: writeXlsxFile } = await import('write-excel-file/browser')
      const heading = (label) => ({ value: label, fontWeight: 'bold', backgroundColor: '#12295C', textColor: '#FFFFFF' })
      const sheets = [
        [[heading('KPI'), heading('Resultado')], ['Solicitudes totales', metrics.total], ['Solicitudes este mes', metrics.thisMonth], ['Sin leer', metrics.unread], ['Pendientes de contacto', metrics.pending], ['Seguimientos vencidos', metrics.overdue], ['Nuevos clientes', metrics.newClients], ['Tasa de conversión', `${metrics.conversionRate}%`]],
        [[heading('Estado'), heading('Cantidad')], ...admissionStatuses.map((status) => [status.label, metrics.statusCounts[status.value] || 0])],
        [[heading('Sede'), heading('Cantidad')], ...entries(metrics.campusCounts)],
        [[heading('Nivel'), heading('Cantidad')], ...entries(metrics.gradeCounts)],
        [[heading('Fecha'), heading('Nombre'), heading('Correo'), heading('Teléfono'), heading('Nivel'), heading('Sede'), heading('Estado'), heading('Leída'), heading('Próxima gestión')], ...requests.map((request) => [new Date(request.created_at), request.parent_name, request.email, request.phone, request.grade, request.campus, statusLabel(request.status), request.read_at ? 'Sí' : 'No', request.follow_up_at ? new Date(request.follow_up_at) : ''])],
      ]
      await writeXlsxFile(sheets, { sheets: ['Resumen', 'Estados', 'Sedes', 'Niveles', 'Solicitudes'], fileName: `reporte-admisiones-paideia-${todayKey()}.xlsx` })
      showFlash('Reporte Excel generado.')
    } catch (error) { showFlash(error.message, 'error') }
  }

  const maxMonth = Math.max(...metrics.months.map((month) => month.value), 1)
  return <section className="admin-dashboard admin-real-dashboard">
    <FlashMessage flash={flash} />
    <header className="admin-section-head admin-section-head-row"><div><p>Resumen de admisiones</p><h1>Dashboard</h1><span>Indicadores calculados con las solicitudes recibidas desde la web.</span></div><div className="admin-actions"><button className="admin-button ghost" type="button" onClick={exportExcel} disabled={!requests.length}>Exportar Excel</button><button className="admin-button secondary" type="button" onClick={exportPdf} disabled={!requests.length}>Exportar PDF</button></div></header>
    {setupRequired ? <div className="admin-module-setup" role="status"><div><strong>Activa el módulo de admisiones para ver datos reales</strong><span>Ejecuta <code>202610210002_admission_requests.sql</code> en Supabase y vuelve a comprobar.</span></div><button className="admin-button" type="button" onClick={load}>Comprobar de nuevo</button></div> : loading ? <div className="dashboard-loading">Cargando información real…</div> : <>
      <div className="dashboard-kpis">
        <article><span>Solicitudes totales</span><strong>{metrics.total}</strong><small>{metrics.thisMonth} recibidas este mes</small></article>
        <article className={metrics.unread ? 'needs-attention' : ''}><span>Sin leer</span><strong>{metrics.unread}</strong><button type="button" onClick={() => onNavigate('requests')}>Revisar solicitudes</button></article>
        <article><span>Pendientes de contacto</span><strong>{metrics.pending}</strong><small>{metrics.overdue} seguimientos vencidos</small></article>
        <article className="is-success"><span>Clientes nuevos</span><strong>{metrics.newClients}</strong><small>{metrics.conversionRate}% de conversión total</small></article>
      </div>
      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-trend"><header><h2>Solicitudes por mes</h2><span>Últimos 6 meses</span></header><div className="dashboard-columns">{metrics.months.map((month) => <div key={month.key}><strong>{month.value}</strong><i style={{ height: `${Math.max((month.value / maxMonth) * 100, month.value ? 8 : 2)}%` }} /><span>{month.label}</span></div>)}</div></section>
        <section className="dashboard-panel dashboard-status"><header><h2>Embudo de seguimiento</h2><span>{metrics.contacted} contactos gestionados</span></header><div>{admissionStatuses.map((status) => <button type="button" onClick={() => onNavigate('requests')} className={`status-${status.value}`} key={status.value}><span>{status.label}</span><strong>{metrics.statusCounts[status.value] || 0}</strong></button>)}</div></section>
      </div>
      <div className="dashboard-distributions"><Distribution title="Interés por sede" data={metrics.campusCounts} /><Distribution title="Interés por nivel" data={metrics.gradeCounts} /></div>
      <footer className="dashboard-report-note"><div><strong>Reporte general</strong><span>Los archivos incluyen indicadores, estados, sedes, niveles y el detalle de solicitudes.</span></div><div className="admin-actions"><button className="admin-button ghost" type="button" onClick={exportExcel}>Descargar Excel</button><button className="admin-button" type="button" onClick={exportPdf}>Descargar PDF</button></div></footer>
    </>}
  </section>
}
