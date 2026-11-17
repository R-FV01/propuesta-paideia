import { useCallback, useEffect, useRef, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../cms/supabase'
import { getUnreadAdmissionCount, subscribeToAdmissionRequests } from '../cms/admissionService'
import Dashboard from './Dashboard'
import MediaLibrary from './MediaLibrary'
import NewsEditor from './NewsEditor'
import RequestsManager from './RequestsManager'
import SectionEditor from './SectionEditor'
import './admin.css'
import './admin-refresh.css'
import './admin-operations.css'

const tabs = [
  ['dashboard', 'Dashboard', 'Indicadores y reportes'], ['requests', 'Solicitudes', 'Admisiones y seguimiento'], ['pages', 'Contenido', 'Textos, botones y apariencia'], ['news', 'Noticias', 'Actualidad de la comunidad'], ['media', 'Multimedia', 'Imágenes y recursos'],
]

function AdminIcon({ name }) {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>, requests: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="m16 11 2 2 4-4" /></>, pages: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>, news: <><path d="M4 5h16v14H4z" /><path d="M8 9h8M8 13h5M16 13h.01" /></>, media: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m3 17 5-4 4 3 3-2 6 4" /></>, external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 13v6H5V6h6" /></>, logout: <><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10" /></>,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const submit = async (event) => { event.preventDefault(); setMessage({ text: 'Ingresando…', type: 'info' }); const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) setMessage({ text: error.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos.' : error.message, type: 'error' }) }
  const reset = async () => { if (!email) { setMessage({ text: 'Escribe tu correo electrónico primero.', type: 'error' }); return } const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}${window.location.pathname}#admin` }); setMessage(error ? { text: error.message, type: 'error' } : { text: 'Revisa tu correo para restablecer la contraseña.', type: 'info' }) }
  return <main className="admin-login"><section className="admin-login-story"><img className="admin-login-photo" src={new URL('../assets/nosotros-hero.jpg', import.meta.url).href} alt="Docente acompañando una actividad con estudiantes de Paideia" /><a href="#inicio" className="admin-login-brand"><span>Paideia</span><small>College</small></a><div><p>Administración</p><h2>Panel de gestión</h2><span>Contenido web, noticias, recursos visuales y seguimiento de admisiones.</span></div></section><form onSubmit={submit}><span className="admin-login-kicker">Acceso administrativo</span><h1>Iniciar sesión</h1><p className="admin-login-copy">Ingresa con tu cuenta autorizada para gestionar el sitio.</p><label>Correo electrónico<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@paideia.edu.pe" /></label><label>Contraseña<input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••" /></label><button className="admin-button" type="submit">Ingresar al panel <span aria-hidden="true">→</span></button><button className="admin-link-button" type="button" onClick={reset}>Olvidé mi contraseña</button>{message && <p className={`admin-notice ${message.type === 'error' ? 'is-error' : ''}`} role={message.type === 'error' ? 'alert' : 'status'}>{message.text}</p>}</form></main>
}

function Preview({ data, onClose }) {
  const [mobile, setMobile] = useState(false)
  return <div className="admin-modal admin-preview-modal" role="dialog" aria-modal="true"><div className="admin-modal-panel"><header><div><p>Vista previa del borrador</p><h2>{data.key}</h2></div><div className="admin-modal-tools"><button type="button" onClick={() => setMobile((value) => !value)}>{mobile ? 'Ver escritorio' : 'Ver móvil'}</button><button type="button" onClick={onClose} aria-label="Cerrar">×</button></div></header><div className={`admin-preview ${mobile ? 'is-mobile' : ''}`}><article>{data.content.image && <img src={data.content.image} alt={data.content.imageAlt || ''} />}<p>{data.content.eyebrow || data.content.kicker}</p><h1>{data.content.title || data.content.brandName || 'Vista previa'}</h1><p>{data.content.subtitle || data.content.intro || data.content.description}</p></article></div></div></div>
}

function PasswordRecovery({ onDone }) {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const submit = async (event) => {
    event.preventDefault()
    if (password.length < 10) { setMessage('Usa al menos 10 caracteres.'); return }
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setMessage(error.message)
    else { setMessage('Contraseña actualizada.'); window.setTimeout(onDone, 700) }
  }
  return <div className="admin-modal" role="dialog" aria-modal="true"><form className="admin-password-form" onSubmit={submit}><span className="admin-login-kicker">Seguridad</span><h2>Define una nueva contraseña</h2><label>Nueva contraseña<input type="password" minLength="10" required autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><button className="admin-button" type="submit">Actualizar contraseña</button>{message && <p className="admin-notice" role="status">{message}</p>}</form></div>
}

export default function AdminApp({ onDirtyChange }) {
  const [session, setSession] = useState(undefined)
  const [authorized, setAuthorized] = useState(undefined)
  const [passwordRecovery, setPasswordRecovery] = useState(false)
  const [tab, setTab] = useState('dashboard')
  const [visitedTabs, setVisitedTabs] = useState(() => new Set(['dashboard']))
  const [dirtyModules, setDirtyModules] = useState({})
  const [unreadCount, setUnreadCount] = useState(0)
  const [preview, setPreview] = useState(null)
  const userIdRef = useRef(undefined)
  const userId = session?.user?.id ?? null
  const hasUnsavedChanges = Object.values(dirtyModules).some(Boolean)
  const setModuleDirty = useCallback((module, dirty) => {
    setDirtyModules((current) => current[module] === dirty ? current : { ...current, [module]: dirty })
  }, [])
  const handleNewsDirty = useCallback((dirty) => setModuleDirty('news', dirty), [setModuleDirty])
  const handlePagesDirty = useCallback((dirty) => setModuleDirty('pages', dirty), [setModuleDirty])
  const handleRequestsDirty = useCallback((dirty) => setModuleDirty('requests', dirty), [setModuleDirty])
  const changeTab = useCallback((nextTab) => {
    setVisitedTabs((current) => {
      if (current.has(nextTab)) return current
      const next = new Set(current)
      next.add(nextTab)
      return next
    })
    setTab(nextTab)
  }, [])
  const confirmDiscard = () => !hasUnsavedChanges || window.confirm('¿Salir y descartar los cambios que todavía no guardaste?')
  const signOut = () => { if (confirmDiscard()) supabase.auth.signOut() }
  useEffect(() => { onDirtyChange?.(hasUnsavedChanges) }, [hasUnsavedChanges, onDirtyChange])
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange])
  useEffect(() => {
    if (!supabase) return
    // Supabase re-emite SIGNED_IN / TOKEN_REFRESHED al volver a la pestaña.
    // Solo se reinicia la verificación de acceso si cambia el usuario; si no, se
    // desmontaría el panel y se perderían los cambios sin guardar.
    const applySession = (next) => {
      const nextUserId = next?.user?.id ?? null
      if (userIdRef.current !== nextUserId) {
        userIdRef.current = nextUserId
        setAuthorized(next ? undefined : false)
      }
      setSession(next)
    }
    supabase.auth.getSession().then(({ data }) => applySession(data.session))
    const { data } = supabase.auth.onAuthStateChange((event, next) => { applySession(next); if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true) })
    return () => data.subscription.unsubscribe()
  }, [])
  useEffect(() => {
    if (!userId) return undefined
    let active = true
    supabase.from('admin_profiles').select('role').eq('id', userId).maybeSingle().then(({ data, error }) => {
      if (active) setAuthorized(!error && data?.role === 'admin')
    })
    return () => { active = false }
  }, [userId])
  useEffect(() => {
    if (!userId || !authorized) return undefined
    const refreshCount = () => getUnreadAdmissionCount().then(setUnreadCount).catch((error) => console.warn('No se pudo cargar el contador de solicitudes.', error))
    refreshCount()
    return subscribeToAdmissionRequests(refreshCount)
  }, [userId, authorized])
  if (!isSupabaseConfigured) return <main className="admin-setup"><div><span className="admin-login-kicker">Configuración requerida</span><h1>Conecta Supabase para activar el panel</h1><p>Copia <code>.env.example</code> como <code>.env.local</code>, agrega las claves públicas y ejecuta la migración incluida.</p><a className="admin-button" href="#inicio">Volver al sitio</a></div></main>
  if (session === undefined || (session && authorized === undefined)) return <main className="admin-loading"><span className="admin-loader" />Verificando acceso…</main>
  if (!session) return <Login />
  if (!authorized) return <main className="admin-setup"><div><span className="admin-login-kicker">Acceso restringido</span><h1>Esta cuenta no es administradora</h1><p>Solicita al responsable del proyecto que registre este usuario en <code>admin_profiles</code>.</p><button className="admin-button" type="button" onClick={() => supabase.auth.signOut()}>Cerrar sesión</button></div></main>
  const activeTab = tabs.find(([key]) => key === tab)
  return <div className="admin-shell"><aside className="admin-sidebar"><a href="#inicio" className="admin-logo"><span>P</span><div><strong>Paideia</strong><small>Administración</small></div></a><nav>{tabs.map(([key, label, description]) => <button type="button" className={tab === key ? 'is-active' : ''} onClick={() => changeTab(key)} key={key}><AdminIcon name={key} /><span><strong>{label}</strong><small>{description}</small></span>{key === 'requests' && unreadCount > 0 && <em className="admin-nav-badge" aria-label={`${unreadCount} solicitudes no leídas`}>{unreadCount > 99 ? '99+' : unreadCount}</em>}</button>)}</nav><div className="admin-account"><span className="admin-avatar">{session.user.email?.slice(0, 1).toUpperCase()}</span><div><strong>Administrador</strong><span>{session.user.email}</span></div><button type="button" onClick={signOut} aria-label="Cerrar sesión"><AdminIcon name="logout" /></button></div></aside><main className="admin-main"><header className="admin-topbar"><div><span>Paideia College</span><strong>{activeTab?.[1]}{dirtyModules[tab] ? ' • Cambios sin guardar' : ''}</strong></div><a href="#inicio" target="_blank" rel="noreferrer">Abrir sitio <AdminIcon name="external" /></a></header><div className="admin-main-content">
    {visitedTabs.has('dashboard') && <div hidden={tab !== 'dashboard'}><Dashboard onNavigate={changeTab} onUnreadChange={setUnreadCount} /></div>}
    {visitedTabs.has('requests') && <div hidden={tab !== 'requests'}><RequestsManager onUnreadChange={setUnreadCount} onDirtyChange={handleRequestsDirty} /></div>}
    {visitedTabs.has('pages') && <div hidden={tab !== 'pages'}><SectionEditor onPreview={(key, content) => setPreview({ key, content })} onDirtyChange={handlePagesDirty} /></div>}
    {visitedTabs.has('news') && <div hidden={tab !== 'news'}><NewsEditor onDirtyChange={handleNewsDirty} /></div>}
    {visitedTabs.has('media') && <div hidden={tab !== 'media'}><section className="admin-workspace"><header className="admin-section-head"><div><p>Recursos visuales</p><h1>Biblioteca multimedia</h1><span>Organiza las imágenes que dan vida a la experiencia Paideia.</span></div></header><MediaLibrary /></section></div>}
  </div></main>{preview && <Preview data={preview} onClose={() => setPreview(null)} />}{passwordRecovery && <PasswordRecovery onDone={() => setPasswordRecovery(false)} />}</div>
}
