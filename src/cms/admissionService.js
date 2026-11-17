import { isSupabaseConfigured, supabase } from './supabase'
export { admissionStatuses } from './admissionConstants'

const ensureConfigured = () => {
  if (!isSupabaseConfigured || !supabase) throw new Error('El servicio de solicitudes todavía no está configurado.')
}

const handleError = (error) => {
  if (error?.code === 'PGRST205' || /admission_requests.*schema cache/i.test(error?.message || '')) {
    const setupError = new Error('El módulo de solicitudes aún no está activado en Supabase.')
    setupError.code = 'ADMISSION_SETUP_REQUIRED'
    throw setupError
  }
  throw error
}

export async function submitAdmissionRequest(form) {
  ensureConfigured()
  const payload = {
    parent_name: form.parent.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim(),
    grade: form.grade,
    campus: form.campus,
    source: 'website',
  }
  const { error } = await supabase.from('admission_requests').insert(payload)
  if (error) handleError(error)
}

export async function listAdmissionRequests() {
  ensureConfigured()
  const { data, error } = await supabase.from('admission_requests').select('*').order('created_at', { ascending: false })
  if (error) handleError(error)
  return data
}

export async function getUnreadAdmissionCount() {
  ensureConfigured()
  const { count, error } = await supabase.from('admission_requests').select('id', { count: 'exact', head: true }).is('read_at', null)
  if (error) handleError(error)
  return count || 0
}

export async function updateAdmissionRequest(id, changes) {
  ensureConfigured()
  const { data, error } = await supabase.from('admission_requests').update(changes).eq('id', id).select().single()
  if (error) handleError(error)
  return data
}

export const markAdmissionRequestRead = (id) => updateAdmissionRequest(id, { read_at: new Date().toISOString() })

export function subscribeToAdmissionRequests(callback) {
  if (!isSupabaseConfigured || !supabase) return () => {}
  const channel = supabase
    .channel(`admission-requests-${crypto.randomUUID()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'admission_requests' }, callback)
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
