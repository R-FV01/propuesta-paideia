import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = join(fileURLToPath(new URL('..', import.meta.url)))
const envFile = join(root, '.env.local')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match && !process.env[match[1].trim()]) process.env[match[1].trim()] = match[2].trim()
  }
}

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) throw new Error('Faltan VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.')
const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

const metadata = {
  'admision-aula.jpg': [534, 480, 'Estudiantes de Paideia trabajando en equipo en el aula'],
  'hero-paideia.png': [846, 540, 'Estudiante de Paideia sonriendo con sus cuadernos'],
  'hero-school.png': [2048, 2048, 'Comunidad educativa Paideia'],
  'inicial.jpg': [447, 447, 'Nivel Inicial de Paideia'], 'nido.jpg': [399, 501, 'Nivel Nido de Paideia'],
  'nosotros-hero.jpg': [1364, 2048, 'Docente Paideia acompañando a una estudiante'],
  'paideia 22 de febrero.png': [1160, 1356, 'Fachada de la sede 22 de Febrero'],
  'paideia america.png': [1122, 1402, 'Fachada de la sede Trujillo'],
  'paideia cedeño.png': [1391, 1131, 'Fachada de la sede Manuel Cedeño'],
  'paideia faq.png': [1254, 1254, 'Estudiantes de Paideia en una actividad académica'],
  'paideia por que elegirnos.png': [1254, 1254, 'Docente acompañando el aprendizaje de una estudiante'],
  'primaria.jpg': [447, 447, 'Nivel Primaria de Paideia'], 'secundaria.jpg': [399, 501, 'Nivel Secundaria de Paideia'],
  'hero-nino.webp': [960, 1199, 'Estudiante de Paideia College levantando el pulgar'],
  'directora-rosa-diaz.jpg': [449, 799, 'Rosa Arleti Díaz Aponte, directora de Paideia College'],
  'logo-paideia.png': [685, 231, 'Logotipo de Paideia College'], 'logo-paideia-light.png': [685, 231, 'Logotipo de Paideia College en versión clara'],
}
for (let index = 1; index <= 6; index += 1) metadata[`nosotros-comunidad-${index}.jpg`] = [2048, 1364, `Momento de la comunidad Paideia ${index}`]

const mimeFor = (file) => ({ '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' })[extname(file).toLowerCase()]
const assetDir = join(root, 'src', 'assets')
const publicUrls = {}
for (const fileName of readdirSync(assetDir).filter((file) => mimeFor(file))) {
  const bytes = readFileSync(join(assetDir, fileName))
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12)
  const safeName = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9.-]+/g, '-').toLowerCase()
  const storagePath = `legacy/${hash}-${safeName}`
  const { error: uploadError } = await supabase.storage.from('site-media').upload(storagePath, bytes, { contentType: mimeFor(fileName), cacheControl: '31536000', upsert: false })
  if (uploadError && !/already exists|duplicate/i.test(uploadError.message)) throw uploadError
  const { data: publicData } = supabase.storage.from('site-media').getPublicUrl(storagePath)
  publicUrls[fileName] = publicData.publicUrl
  const [width = 0, height = 0, altText = basename(fileName, extname(fileName))] = metadata[fileName] || []
  const { error: mediaError } = await supabase.from('media_assets').upsert({ storage_path: storagePath, public_url: publicData.publicUrl, alt_text: altText, width, height, size_bytes: bytes.length, mime_type: mimeFor(fileName), focal_x: 50, focal_y: 50 }, { onConflict: 'storage_path' })
  if (mediaError) throw mediaError
}

const sourcePath = join(root, 'src', 'content', 'defaultContent.js')
let source = readFileSync(sourcePath, 'utf8')
const bindings = []
source = source.replace(/^import\s+(\w+)\s+from\s+['"]\.\.\/assets\/(.+?)['"]\s*$/gm, (_line, variable, fileName) => { bindings.push([variable, publicUrls[fileName]]); return '' })
source = source.replace(/export const /g, 'const ')
source += '\nreturn { defaultSections, defaultNews };'
const seeded = new Function(...bindings.map(([name]) => name), source)(...bindings.map(([, value]) => value))

for (const [key, content] of Object.entries(seeded.defaultSections)) {
  const { error } = await supabase.from('site_sections').upsert({ key, draft_content: content, published_content: content, status: 'published', published_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) throw error
}
for (const item of seeded.defaultNews) {
  const { id: _legacyId, slug, sortOrder, ...content } = item
  const { error } = await supabase.from('news_posts').upsert({ slug, draft_content: { ...content, slug, sortOrder }, published_content: { ...content, slug, sortOrder }, featured: Boolean(content.featured), sort_order: sortOrder, status: 'published', published_at: new Date().toISOString() }, { onConflict: 'slug' })
  if (error) throw error
}

if (process.env.CMS_ADMIN_USER_ID) {
  const { error } = await supabase.from('admin_profiles').upsert({ id: process.env.CMS_ADMIN_USER_ID, role: 'admin' })
  if (error) throw error
}
console.log(`Migración completada: ${Object.keys(seeded.defaultSections).length} secciones, ${seeded.defaultNews.length} noticias y ${Object.keys(publicUrls).length} imágenes.`)
