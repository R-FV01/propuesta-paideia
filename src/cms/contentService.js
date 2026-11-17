import { defaultNews, defaultSections } from '../content/defaultContent'
import { isSupabaseConfigured, supabase } from './supabase'

const CACHE_KEY = 'paideia:published-content:v1'

// Combina cada sección remota con sus valores por defecto para que los campos
// nuevos del diseño existan aunque el CMS guarde una versión anterior.
export const mergeSections = (remote = {}) => {
  const keys = new Set([...Object.keys(defaultSections), ...Object.keys(remote || {})])
  return Object.fromEntries([...keys].map((key) => {
    const base = defaultSections[key]
    const value = remote?.[key]
    if (base && value && typeof base === 'object' && typeof value === 'object' && !Array.isArray(base)) return [key, { ...base, ...value }]
    return [key, value ?? base]
  }))
}

const getCached = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) } catch { return null }
}

export async function loadPublishedContent() {
  if (!isSupabaseConfigured) return { sections: defaultSections, news: defaultNews, source: 'defaults' }
  try {
    const [sectionsResult, newsResult] = await Promise.all([
      supabase.from('public_site_sections').select('key, content, published_at, updated_at'),
      supabase.from('public_news_posts').select('id, slug, content, published_at, sort_order').order('sort_order'),
    ])
    if (sectionsResult.error) throw sectionsResult.error
    if (newsResult.error) throw newsResult.error
    const remoteSections = Object.fromEntries(sectionsResult.data.map((row) => [row.key, row.content]))
    const sections = mergeSections(remoteSections)
    const news = newsResult.data.map((row) => ({ id: row.id, slug: row.slug, ...row.content, sortOrder: row.sort_order }))
    const result = { sections, news, source: 'remote' }
    localStorage.setItem(CACHE_KEY, JSON.stringify(result))
    return result
  } catch (error) {
    console.warn('No se pudo cargar el CMS; se usará la última versión disponible.', error)
    const cached = getCached()
    return cached
      ? { ...cached, sections: mergeSections(cached.sections), news: cached.news ?? defaultNews, source: 'cache' }
      : { sections: defaultSections, news: defaultNews, source: 'defaults' }
  }
}

export async function getAdminSections() {
  const { data, error } = await supabase.from('site_sections').select('*').order('key')
  if (error) throw error
  return data
}

export async function saveSectionDraft(key, content) {
  const { data, error } = await supabase.from('site_sections').upsert({ key, draft_content: content, status: 'draft' }, { onConflict: 'key' }).select().single()
  if (error) throw error
  return data
}

export async function publishSection(key) {
  const { error } = await supabase.rpc('publish_site_section', { section_key: key })
  if (error) throw error
}

export async function getAdminNews() {
  const { data, error } = await supabase.from('news_posts').select('*').order('sort_order')
  if (error) throw error
  return data
}

export async function saveNewsDraft(post) {
  const id = post.id && /^[0-9a-f-]{36}$/i.test(post.id) ? post.id : undefined
  const payload = { ...(id ? { id } : {}), slug: post.slug, draft_content: post.content, featured: Boolean(post.content.featured), sort_order: Number(post.content.sortOrder || 0), status: 'draft' }
  const { data, error } = await supabase.from('news_posts').upsert(payload, { onConflict: 'slug' }).select().single()
  if (error) throw error
  return data
}

export async function publishNews(id) {
  const { error } = await supabase.rpc('publish_news_post', { post_id: id })
  if (error) throw error
}

export async function removeNews(id) {
  const { error } = await supabase.from('news_posts').delete().eq('id', id)
  if (error) throw error
}
