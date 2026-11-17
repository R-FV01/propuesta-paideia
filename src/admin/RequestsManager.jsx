import { useCallback, useEffect, useMemo, useState } from 'react'
import { admissionStatuses, listAdmissionRequests, markAdmissionRequestRead, subscribeToAdmissionRequests, updateAdmissionRequest } from '../cms/admissionService'
import useFlash, { FlashMessage } from './useFlash'

const dateTimeFormat = new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' })
const toLocalInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  const pad = (number) => String(number).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const statusLabel = (value) => admissionStatuses.find((status) => status.value === value)?.label || value
const phoneLink = (phone) => `https://wa.me/${phone.replace(/\D/g, '')}`

export default function RequestsManager({ onUnreadChange, onDirtyChange }) {
  const [requests, setRequests] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [draft, setDraft] = useState({ status: 'not_contacted', notes: '', follow_up_at: '' })
  const [savedDraft, setSavedDraft] = useState(() => JSON.stringify({ status: 'not_contacted', notes: '', follow_up_at: '' }))
  const dirty = JSON.stringify(draft) !== savedDraft
  const [loading, setLoading] = useState(true)
  const [setupRequired, setSetupRequired] = useState(false)
  const { flash, showFlash } = useFlash()

  const load = useCallback(async () => {
    try {
      const data = await listAdmissionRequests()
      setSetupRequired(false)
      setRequests(data)
      onUnreadChange?.(data.filter((request) => !request.read_at).length)
      setSelectedId((current) => current || data[0]?.id || null)
    } catch (error) {
      if (error.code === 'ADMISSION_SETUP_REQUIRED') setSetupRequired(true)
      else showFlash(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [onUnreadChange, showFlash])

  useEffect(() => {
    load()
    return subscribeToAdmissionRequests(load)
  }, [load])

  const selected = requests.find((request) => request.id === selectedId)
  useEffect(() => {
    if (!selected) return
    const next = { status: selected.status, notes: selected.notes || '', follow_up_at: toLocalInput(selected.follow_up_at) }
    setDraft(next)
    setSavedDraft(JSON.stringify(next))
  }, [selectedId, selected?.updated_at])
  useEffect(() => { onDirtyChange?.(dirty) }, [dirty, onDirtyChange])

  const selectRequest = (id) => {
    if (id === selectedId) return
    if (dirty && !window.confirm('¿Cambiar de solicitud y descartar el seguimiento sin guardar?')) return
    setSelectedId(id)
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return requests.filter((request) => {
      const matchesSearch = !term || [request.parent_name, request.email, request.phone, request.grade, request.campus].some((value) => value?.toLowerCase().includes(term))
      return matchesSearch && (statusFilter === 'all' || request.status === statusFilter) && (!unreadOnly || !request.read_at)
    })
  }, [requests, search, statusFilter, unreadOnly])

  const counts = Object.fromEntries(admissionStatuses.map(({ value }) => [value, requests.filter((request) => request.status === value).length]))

  const markRead = async () => {
    if (!selected || selected.read_at) return
    try {
      const updated = await markAdmissionRequestRead(selected.id)
      setRequests((current) => current.map((request) => request.id === updated.id ? updated : request))
      onUnreadChange?.(requests.filter((request) => !request.read_at && request.id !== selected.id).length)
      showFlash('Solicitud marcada como leída.')
    } catch (error) { showFlash(error.message, 'error') }
  }

  const saveFollowUp = async () => {
    if (!selected) return
    const changes = {
      status: draft.status,
      notes: draft.notes.trim(),
      follow_up_at: draft.follow_up_at ? new Date(draft.follow_up_at).toISOString() : null,
    }
    if (['contacted', 'new_client'].includes(draft.status) && !['contacted', 'new_client'].includes(selected.status)) changes.last_contact_at = new Date().toISOString()
    try {
      const updated = await updateAdmissionRequest(selected.id, changes)
      setRequests((current) => current.map((request) => request.id === updated.id ? updated : request))
      setSavedDraft(JSON.stringify({ status: updated.status, notes: updated.notes || '', follow_up_at: toLocalInput(updated.follow_up_at) }))
      showFlash(draft.status === 'new_client' ? 'Seguimiento guardado: nuevo cliente registrado.' : 'Seguimiento actualizado.')
    } catch (error) { showFlash(error.message, 'error') }
  }

  return <section className="admin-workspace admin-requests">
    <FlashMessage flash={flash} />
    <header className="admin-section-head admin-section-head-row">
      <div><p>Admisiones</p><h1>Solicitudes</h1><span>Revisa cada contacto, registra el avance y convierte consultas en nuevas matrículas.</span></div>
      <button type="button" className="admin-button ghost" onClick={load}>Actualizar</button>
    </header>

    {setupRequired && <div className="admin-module-setup" role="status"><div><strong>Falta activar las solicitudes en Supabase</strong><span>Ejecuta la migración <code>202610210002_admission_requests.sql</code> en el SQL Editor. Después pulsa “Comprobar de nuevo”.</span></div><button className="admin-button" type="button" onClick={load}>Comprobar de nuevo</button></div>}

    {!setupRequired && <><div className="request-pipeline" aria-label="Resumen por estado">
      {admissionStatuses.map((status) => <button type="button" className={statusFilter === status.value ? `is-active status-${status.value}` : `status-${status.value}`} onClick={() => setStatusFilter(status.value)} key={status.value}><span>{status.label}</span><strong>{counts[status.value]}</strong></button>)}
    </div>

    <div className="request-toolbar">
      <label className="request-search"><span className="sr-only">Buscar solicitudes</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, correo, teléfono…" /></label>
      <select aria-label="Filtrar por estado" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">Todos los estados</option>{admissionStatuses.map((status) => <option value={status.value} key={status.value}>{status.label}</option>)}</select>
      <label className="request-unread-toggle"><input type="checkbox" checked={unreadOnly} onChange={(event) => setUnreadOnly(event.target.checked)} /> Solo no leídas</label>
    </div>

    <div className="request-layout">
      <aside className="request-list" aria-label="Lista de solicitudes">
        {loading && <p className="request-empty">Cargando solicitudes…</p>}
        {!loading && filtered.length === 0 && <p className="request-empty">No hay solicitudes con estos filtros.</p>}
        {filtered.map((request) => <button type="button" className={`${selectedId === request.id ? 'is-active ' : ''}${!request.read_at ? 'is-unread' : ''}`} onClick={() => selectRequest(request.id)} key={request.id}>
          <span className="request-list-top"><strong>{request.parent_name}</strong>{!request.read_at && <i aria-label="No leída" />}</span>
          <span>{request.grade}</span><small>{request.campus} · {dateTimeFormat.format(new Date(request.created_at))}</small>
          <em className={`request-status status-${request.status}`}>{statusLabel(request.status)}</em>
        </button>)}
      </aside>

      <article className="request-detail">
        {!selected ? <div className="request-detail-empty"><strong>Selecciona una solicitud</strong><span>Aquí verás los datos y el seguimiento.</span></div> : <>
          <header className={!selected.read_at ? 'is-unread' : ''}>
            <div><span className="request-eyebrow">Solicitud {selected.read_at ? 'revisada' : 'nueva'}</span><h2>{selected.parent_name}</h2><p>Recibida el {dateTimeFormat.format(new Date(selected.created_at))}</p></div>
            {!selected.read_at && <button className="admin-button" type="button" onClick={markRead}>Marcar como leída</button>}
          </header>
          <div className="request-contact-grid">
            <div><span>Correo</span><a href={`mailto:${selected.email}`}>{selected.email}</a></div>
            <div><span>Teléfono</span><a href={`tel:${selected.phone}`}>{selected.phone}</a></div>
            <div><span>Nivel</span><strong>{selected.grade}</strong></div>
            <div><span>Sede</span><strong>{selected.campus}</strong></div>
          </div>
          <div className="request-contact-actions"><a href={phoneLink(selected.phone)} target="_blank" rel="noreferrer">Abrir WhatsApp</a><a href={`mailto:${selected.email}`}>Enviar correo</a></div>
          <div className="request-followup">
            <h3>Seguimiento comercial</h3>
            <div className="admin-form-grid">
              <label>Estado<select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>{admissionStatuses.map((status) => <option value={status.value} key={status.value}>{status.label}</option>)}</select></label>
              <label>Próxima gestión<input type="datetime-local" value={draft.follow_up_at} onChange={(event) => setDraft({ ...draft, follow_up_at: event.target.value })} /></label>
              <label className="admin-field-wide">Notas internas<textarea rows="5" maxLength="3000" value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} placeholder="Acuerdos, dudas de la familia, próxima acción…" /></label>
            </div>
            <div className="request-followup-footer"><span>{selected.last_contact_at ? `Último contacto: ${dateTimeFormat.format(new Date(selected.last_contact_at))}` : 'Todavía no se registró contacto.'}</span><button className="admin-button" type="button" onClick={saveFollowUp}>Guardar seguimiento</button></div>
          </div>
        </>}
      </article>
    </div></>}
  </section>
}
