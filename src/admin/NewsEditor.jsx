import { useEffect, useState } from 'react'
import { getAdminNews, publishNews, removeNews, saveNewsDraft } from '../cms/contentService'
import { validateNews } from '../cms/validation'
import ImageField from './ImageField'
import useFlash, { FlashMessage } from './useFlash'

const emptyNews = { slug: '', category: 'Académico', level: 'General', date: '', title: '', excerpt: '', body: '', image: '', imageAlt: '', featured: false, sortOrder: 100 }

export default function NewsEditor({ onDirtyChange }) {
  const [rows, setRows] = useState([])
  const [selected, setSelected] = useState(null)
  const [draft, setDraft] = useState(emptyNews)
  const [savedDraft, setSavedDraft] = useState(() => JSON.stringify(emptyNews))
  const dirty = JSON.stringify(draft) !== savedDraft
  const { flash, showFlash } = useFlash()
  const load = async () => setRows(await getAdminNews())
  useEffect(() => { load().catch((error) => showFlash(error.message, 'error')) }, [showFlash])
  useEffect(() => { onDirtyChange?.(dirty) }, [dirty, onDirtyChange])
  const choose = (row) => {
    if (dirty && !window.confirm('¿Cambiar de noticia y descartar los cambios sin guardar?')) return
    const next = { ...(row.draft_content || row.published_content), slug: row.slug, sortOrder: row.sort_order }
    setSelected(row); setDraft(next); setSavedDraft(JSON.stringify(next))
  }
  const save = async (publish = false) => {
    const errors = validateNews(draft); if (errors.length) { showFlash(errors.join(' '), 'error'); return }
    try { const row = await saveNewsDraft({ id: selected?.id, slug: draft.slug, content: draft }); if (publish) await publishNews(row.id); setSavedDraft(JSON.stringify(draft)); showFlash(publish ? 'Noticia publicada correctamente.' : 'Borrador guardado.'); await load(); setSelected(row) } catch (error) { showFlash(error.message, 'error') }
  }
  const remove = async () => { if (!selected || !window.confirm('¿Eliminar esta noticia definitivamente?')) return; try { await removeNews(selected.id); setSelected(null); setDraft(emptyNews); setSavedDraft(JSON.stringify(emptyNews)); await load(); showFlash('Noticia eliminada.') } catch (error) { showFlash(error.message, 'error') } }
  const createNews = () => {
    if (dirty && !window.confirm('¿Crear otra noticia y descartar los cambios sin guardar?')) return
    setSelected(null); setSavedDraft(JSON.stringify(emptyNews)); setDraft({ ...emptyNews, slug: `noticia-${Date.now()}` })
  }
  return <section className="admin-workspace"><FlashMessage flash={flash} /><header className="admin-section-head"><div><p>Vida Paideia</p><h1>Noticias</h1></div><button type="button" className="admin-button" onClick={createNews}>Nueva noticia</button></header><div className="admin-news-layout"><aside className="admin-news-list">{rows.map((row) => <button type="button" className={selected?.id === row.id ? 'is-active' : ''} onClick={() => choose(row)} key={row.id}><strong>{row.draft_content?.title || row.published_content?.title}</strong><span>{row.status === 'draft' ? 'Borrador pendiente' : 'Publicado'}</span></button>)}</aside><div className="admin-news-form"><div className="admin-form-grid"><label>Slug<input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} /></label><label>Fecha visible<input value={draft.date} maxLength="30" onChange={(e) => setDraft({ ...draft, date: e.target.value })} placeholder="OCT 2026" /></label><label>Categoría<select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>{['Académico', 'Eventos', 'Comunicados', 'Deportes y Arte'].map((value) => <option key={value}>{value}</option>)}</select></label><label>Nivel<select value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value })}>{['Nido', 'Inicial', 'Primaria', 'Secundaria', 'General'].map((value) => <option key={value}>{value}</option>)}</select></label><label className="admin-field-wide">Título<input value={draft.title} maxLength="140" onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label><label className="admin-field-wide">Resumen<textarea value={draft.excerpt} maxLength="260" onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} /></label><label className="admin-field-wide">Contenido<textarea rows="8" value={draft.body} maxLength="5000" onChange={(e) => setDraft({ ...draft, body: e.target.value })} /></label><ImageField label="Imagen de portada" value={draft.image} alt={draft.imageAlt} onChange={(image, imageAlt) => setDraft({ ...draft, image, imageAlt })} /><label>Texto alternativo<input value={draft.imageAlt} maxLength="180" onChange={(e) => setDraft({ ...draft, imageAlt: e.target.value })} /></label><label>Orden<input type="number" value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} /></label><label className="admin-check"><input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} /> Noticia destacada</label></div><div className="admin-actions"><button type="button" className="admin-button danger" disabled={!selected} onClick={remove}>Eliminar</button><button type="button" className="admin-button secondary" onClick={() => save(false)}>Guardar borrador</button><button type="button" className="admin-button" onClick={() => save(true)}>Publicar</button></div></div></div></section>
}
