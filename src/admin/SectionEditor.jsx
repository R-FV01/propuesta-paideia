import { useEffect, useState } from 'react'
import { defaultSections } from '../content/defaultContent'
import { getAdminSections, publishSection, saveSectionDraft } from '../cms/contentService'
import { validateSection } from '../cms/validation'
import ImageField from './ImageField'
import useFlash, { FlashMessage } from './useFlash'

const labels = {
  eyebrow: 'Etiqueta superior', kicker: 'Etiqueta', title: 'Título', subtitle: 'Subtítulo', intro: 'Introducción', image: 'Imagen', imageAlt: 'Texto alternativo', label: 'Texto del botón', href: 'Destino del botón', name: 'Nombre', age: 'Edad', text: 'Descripción', detail: 'Descripción', buttonLabel: 'Texto del botón', buttonHref: 'Destino del botón', imageBadgeTitle: 'Título de insignia', imageBadgeText: 'Texto de insignia', galleryKicker: 'Etiqueta de galería', galleryTitle: 'Título de galería', visualKicker: 'Etiqueta sobre imagen', visualTitle: 'Título sobre imagen', imageKicker: 'Etiqueta sobre imagen', imageCaption: 'Texto sobre imagen', submitLabel: 'Texto del botón',
  brandName: 'Nombre de marca', brandSubtitle: 'Descriptor de marca', homeLabel: 'Inicio', aboutLabel: 'Nosotros', educationLabel: 'Propuesta educativa', levelsLabel: 'Niveles', approachLabel: 'Enfoque', lifeLabel: 'Vida institucional', campusesLabel: 'Sedes', newsLabel: 'Noticias', contactLabel: 'Contacto', admissionLabel: 'Botón de admisión', primaryColor: 'Dorado principal', accentColor: 'Naranja de acento', navyColor: 'Azul institucional', backgroundColor: 'Fondo general', description: 'Descripción institucional', exploreTitle: 'Título de enlaces', locationsTitle: 'Título de sedes', contactTitle: 'Título de contacto', phoneLabel: 'Teléfono visible', phoneHref: 'Enlace telefónico', email: 'Correo electrónico', schedule: 'Horario de atención', copyrightName: 'Nombre legal visible', privacyLabel: 'Texto de privacidad', privacyHref: 'Enlace de privacidad', termsLabel: 'Texto de términos', termsHref: 'Enlace de términos', address: 'Dirección',
  badge: 'Etiqueta destacada', highlight: 'Texto resaltado (naranja)', titleEnd: 'Final del título', directorName: 'Nombre de la directora', directorRole: 'Cargo', tagline: 'Frase del nivel', cardKicker: 'Etiqueta de las tarjetas', whatsappNumber: 'WhatsApp (con código de país, ej. 51908805756)', whatsappMessage: 'Mensaje inicial de WhatsApp', socialsTitle: 'Título de redes sociales',
  blueColor: 'Azul institucional', orangeColor: 'Naranja', navyColor: 'Azul marino (footer)', deepNavyColor: 'Azul oscuro (navbar)', creamColor: 'Crema (fondo)', skyColor: 'Celeste (Nido)', yellowColor: 'Amarillo (Inicial)', periwinkleColor: 'Azul lavanda (Primaria)', tealColor: 'Azul petróleo (Nido)',
}
const sectionNames = { global: 'Identidad y menú', brandTheme: 'Paleta de colores', homeHero: 'Portada', welcome: 'Bienvenida', whyHome: '¿Por qué Paideia?', proposal: 'Propuesta educativa', steps: 'Proceso de admisión', levels: 'Niveles', campuses: 'Sedes', about: 'Nosotros y galería', faq: 'Preguntas frecuentes', admission: 'Admisión', footer: 'Footer y contacto' }
const topFields = {
  global: ['brandName', 'brandSubtitle', 'homeLabel', 'aboutLabel', 'educationLabel', 'levelsLabel', 'approachLabel', 'lifeLabel', 'campusesLabel', 'newsLabel', 'contactLabel', 'admissionLabel', 'whatsappNumber', 'whatsappMessage'],
  brandTheme: ['blueColor', 'orangeColor', 'navyColor', 'deepNavyColor', 'creamColor', 'skyColor', 'yellowColor', 'periwinkleColor', 'tealColor'],
  homeHero: ['badge', 'title', 'buttonLabel', 'image', 'imageAlt'],
  welcome: ['kicker', 'title', 'highlight', 'paragraphs', 'directorName', 'directorRole', 'image', 'imageAlt'],
  whyHome: ['title', 'highlight', 'titleEnd', 'reasons'],
  proposal: ['title', 'highlight', 'items'],
  steps: ['kicker', 'title', 'highlight', 'items'],
  levels: ['cardKicker', 'buttonLabel', 'items'], campuses: ['kicker', 'title', 'intro', 'buttonLabel', 'items'],
  why: ['image', 'imageAlt', 'kicker', 'title', 'intro', 'reasons'],
  about: ['kicker', 'title', 'intro', 'image', 'imageAlt', 'buttonLabel', 'buttonHref', 'imageBadgeTitle', 'imageBadgeText', 'galleryKicker', 'galleryTitle', 'gallery'],
  faq: ['image', 'imageAlt', 'visualKicker', 'visualTitle', 'kicker', 'title', 'intro'],
  admission: ['image', 'imageAlt', 'kicker', 'title', 'imageKicker', 'imageCaption', 'submitLabel'],
  footer: ['exploreTitle', 'exploreLinks', 'contactTitle', 'phoneLabel', 'phoneHref', 'locations', 'socialsTitle', 'socials', 'copyrightName', 'privacyLabel', 'privacyHref', 'termsLabel', 'termsHref'],
}
const itemFields = { items: ['image', 'imageAlt', 'name', 'title', 'tagline', 'age', 'text', 'detail'], reasons: ['title', 'text'], paragraphs: ['text'], gallery: ['image', 'imageAlt'], socials: ['name', 'label', 'href'], exploreLinks: ['label', 'href'], locations: ['name', 'address'] }
const longFields = new Set(['intro', 'text', 'detail', 'description', 'schedule', 'whatsappMessage'])
const removableLists = new Set(['gallery', 'socials', 'exploreLinks', 'locations'])
const listLabels = { paragraphs: 'Párrafos (usa **texto** para negrita)', gallery: 'Imágenes de la galería', reasons: 'Tarjetas', socials: 'Redes sociales', exploreLinks: 'Enlaces del footer', locations: 'Sedes del footer', items: 'Elementos' }
const objectLabels = { primaryButton: 'Botón principal', secondaryButton: 'Botón secundario', admissionButton: 'Botón de admisión' }

const clone = (value) => structuredClone(value)
const updateAt = (source, path, value) => {
  const next = clone(source); let cursor = next
  path.slice(0, -1).forEach((key) => { cursor = cursor[key] })
  cursor[path.at(-1)] = value
  return next
}

function Field({ field, value, alt, onChange, onImageChange }) {
  if (field === 'image') return <ImageField label="Imagen" value={value} alt={alt} onChange={onImageChange} />
  if (value && typeof value === 'object' && !Array.isArray(value)) return <fieldset className="admin-subgroup"><legend>{objectLabels[field] || 'Configuración'}</legend>{Object.entries(value).map(([child, childValue]) => <Field field={child} value={childValue} onChange={(next) => onChange({ ...value, [child]: next })} key={child} />)}</fieldset>
  if (field.endsWith('Color')) return <label className="admin-color-field">{labels[field]}<span><input type="color" value={value} onChange={(event) => onChange(event.target.value)} /><input value={value} pattern="#[0-9a-fA-F]{6}" onChange={(event) => onChange(event.target.value)} /></span></label>
  if (field === 'name' && ['facebook', 'instagram', 'tiktok'].includes(value)) return <label>{labels[field]}<select value={value} onChange={(event) => onChange(event.target.value)}><option value="facebook">Facebook</option><option value="instagram">Instagram</option><option value="tiktok">TikTok</option></select></label>
  const maxLength = field === 'title' ? 140 : longFields.has(field) ? 500 : 180
  return <label className={longFields.has(field) ? 'admin-field-wide' : ''}>{labels[field] || field}{longFields.has(field) ? <textarea value={value || ''} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} /> : <input value={value || ''} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} />}</label>
}

export default function SectionEditor({ onPreview, onDirtyChange }) {
  const [rows, setRows] = useState([])
  const [active, setActive] = useState('homeHero')
  const [draft, setDraft] = useState(clone(defaultSections.homeHero))
  const [savedDraft, setSavedDraft] = useState(() => JSON.stringify(defaultSections.homeHero))
  const dirty = JSON.stringify(draft) !== savedDraft
  const { flash, showFlash } = useFlash()
  const load = async () => { const data = await getAdminSections(); setRows(data) }
  useEffect(() => { load().catch((error) => showFlash(error.message, 'error')) }, [showFlash])
  useEffect(() => { const row = rows.find((item) => item.key === active); const stored = row?.draft_content || row?.published_content; const next = clone(stored ? { ...defaultSections[active], ...stored } : defaultSections[active]); setDraft(next); setSavedDraft(JSON.stringify(next)) }, [active, rows])
  useEffect(() => { onDirtyChange?.(dirty) }, [dirty, onDirtyChange])
  const setField = (path, value) => setDraft((current) => updateAt(current, path, value))
  const save = async () => { const errors = validateSection(active, draft); if (errors.length) { showFlash(errors.join(' '), 'error'); return } try { await saveSectionDraft(active, draft); setSavedDraft(JSON.stringify(draft)); showFlash('Borrador guardado. La web pública no ha cambiado.'); await load() } catch (error) { showFlash(error.message, 'error') } }
  const publish = async () => { const errors = validateSection(active, draft); if (errors.length) { showFlash(errors.join(' '), 'error'); return } try { await saveSectionDraft(active, draft); await publishSection(active); setSavedDraft(JSON.stringify(draft)); showFlash('Contenido publicado correctamente.'); await load() } catch (error) { showFlash(error.message, 'error') } }
  const selectSection = (key) => {
    if (key === active) return
    if (dirty && !window.confirm('¿Cambiar de sección y descartar los cambios sin guardar?')) return
    setActive(key)
  }
  const move = (field, index, direction) => { const target = index + direction; if (target < 0 || target >= draft[field].length) return; const items = [...draft[field]]; [items[index], items[target]] = [items[target], items[index]]; setField([field], items) }
  return <section className="admin-workspace"><FlashMessage flash={flash} /><header className="admin-section-head"><div><p>Contenido del sitio</p><h1>Contenido y diseño</h1><span>Personaliza los textos, imágenes, botones y detalles de marca más importantes.</span></div><div className="admin-actions"><button className="admin-button ghost" type="button" onClick={() => onPreview(active, draft)}>Vista previa</button><button className="admin-button secondary" type="button" onClick={save}>Guardar borrador</button><button className="admin-button" type="button" onClick={publish}>Publicar</button></div></header>
    <div className="admin-section-tabs">{Object.entries(sectionNames).map(([key, name]) => <button type="button" className={active === key ? 'is-active' : ''} onClick={() => selectSection(key)} key={key}>{name}<small>{rows.find((row) => row.key === key)?.status === 'draft' ? 'Borrador pendiente' : 'Publicado'}</small></button>)}</div>
    <div className="admin-form-grid">{topFields[active].map((field) => {
      const value = draft[field]
      if (Array.isArray(value)) return <fieldset className="admin-repeaters admin-field-wide" key={field}><legend>{listLabels[field]}</legend>{value.map((item, index) => <article className="admin-repeater" key={item.id || index}><header><strong>{item.label || item.name || item.title || `${field === 'gallery' ? 'Imagen' : 'Elemento'} ${index + 1}`}</strong><div><button type="button" onClick={() => move(field, index, -1)} aria-label="Mover arriba">↑</button><button type="button" onClick={() => move(field, index, 1)} aria-label="Mover abajo">↓</button>{removableLists.has(field) && <button type="button" onClick={() => setField([field], value.filter((_, itemIndex) => itemIndex !== index))} aria-label="Eliminar">×</button>}</div></header><div className="admin-form-grid">{itemFields[field].filter((child) => child in item).map((child) => <Field field={child} value={item[child]} alt={item.imageAlt} onChange={(next) => setField([field, index, child], next)} onImageChange={(url, altText) => { setDraft((current) => { let next = updateAt(current, [field, index, 'image'], url); next = updateAt(next, [field, index, 'imageAlt'], altText); return next }) }} key={child} />)}</div></article>)}{removableLists.has(field) && <button type="button" className="admin-button ghost" onClick={() => { const item = field === 'gallery' ? { id: crypto.randomUUID(), image: '', imageAlt: '' } : field === 'socials' ? { id: crypto.randomUUID(), name: 'facebook', label: 'Nueva red', href: 'https://' } : field === 'exploreLinks' ? { id: crypto.randomUUID(), label: 'Nuevo enlace', href: '#inicio' } : { id: crypto.randomUUID(), name: 'Nueva sede', address: '' }; setField([field], [...value, item]) }}>Añadir elemento</button>}</fieldset>
      return <Field field={field} value={value} alt={draft.imageAlt} onChange={(next) => setField([field], next)} onImageChange={(url, altText) => { setDraft((current) => ({ ...current, image: url, imageAlt: altText })) }} key={field} />
    })}</div>
  </section>
}
