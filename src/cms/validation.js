export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024

export function validateImageFile(file) {
  if (!file) return 'Selecciona una imagen.'
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Solo se permiten archivos JPEG, PNG o WebP.'
  if (file.size > MAX_IMAGE_BYTES) return 'La imagen no puede superar los 10 MB.'
  return null
}

export function isSafeLink(value) {
  if (!value) return false
  if (value.startsWith('#') || value.startsWith('/')) return true
  try {
    const url = new URL(value)
    return ['https:', 'mailto:', 'tel:'].includes(url.protocol)
  } catch { return false }
}

export function validateSection(key, content) {
  const errors = []
  if (!content || typeof content !== 'object') return ['El contenido no es válido.']
  const required = {
    global: ['brandName', 'brandSubtitle', 'homeLabel', 'aboutLabel', 'educationLabel', 'lifeLabel', 'contactLabel', 'admissionLabel'],
    theme: ['primaryColor', 'accentColor', 'navyColor', 'backgroundColor'],
    brandTheme: ['blueColor', 'orangeColor', 'navyColor', 'deepNavyColor', 'creamColor', 'skyColor', 'yellowColor', 'periwinkleColor', 'tealColor'],
    homeHero: ['badge', 'title', 'buttonLabel', 'image', 'imageAlt'],
    welcome: ['kicker', 'title', 'directorName', 'image', 'imageAlt'],
    whyHome: ['title'], proposal: ['title'], steps: ['title'],
    hero: ['eyebrow', 'title', 'subtitle', 'image', 'imageAlt'],
    levels: ['kicker', 'title', 'intro'], campuses: ['kicker', 'title', 'intro'],
    why: ['image', 'imageAlt', 'kicker', 'title', 'intro'], about: ['image', 'imageAlt', 'kicker', 'title', 'intro'],
    faq: ['image', 'imageAlt', 'kicker', 'title', 'intro'], admission: ['image', 'imageAlt', 'kicker', 'title'],
    footer: ['exploreTitle', 'contactTitle', 'phoneLabel', 'phoneHref', 'copyrightName'],
  }[key] || []
  required.forEach((field) => { if (!String(content[field] || '').trim()) errors.push(`El campo ${field} es obligatorio.`) })
  if (key === 'hero') {
    if (!isSafeLink(content.primaryButton?.href)) errors.push('El enlace del botón principal no es válido.')
    if (!isSafeLink(content.secondaryButton?.href)) errors.push('El enlace del botón secundario no es válido.')
  }
  if (key === 'about' && !isSafeLink(content.buttonHref)) errors.push('El enlace del botón de Nosotros no es válido.')
  if (['theme', 'brandTheme'].includes(key) && required.some((field) => !/^#[0-9a-fA-F]{6}$/.test(content[field] || ''))) errors.push('Todos los colores deben usar el formato hexadecimal #RRGGBB.')
  if (key === 'footer') {
    const links = [...(content.socials || []), ...(content.exploreLinks || []), { href: content.phoneHref }, { href: content.privacyHref }, { href: content.termsHref }]
    if (links.some((item) => !isSafeLink(item.href))) errors.push('Revisa los enlaces del footer; uno o más no son válidos.')
    if (content.email && !/^\S+@\S+\.\S+$/.test(content.email)) errors.push('El correo de contacto no es válido.')
    if (!content.socials?.length) errors.push('Configura al menos una red social.')
  }
  if (key === 'global' && content.whatsappNumber && !/^\d{8,15}$/.test(String(content.whatsappNumber).replace(/\D/g, ''))) errors.push('El número de WhatsApp debe tener entre 8 y 15 dígitos.')
  if (key === 'welcome' && !content.paragraphs?.length) errors.push('Agrega al menos un párrafo de bienvenida.')
  if (key === 'whyHome' && !content.reasons?.length) errors.push('Agrega al menos una tarjeta.')
  if (['levels', 'campuses', 'proposal', 'steps'].includes(key) && !content.items?.length) errors.push('Debe existir al menos un elemento.')
  if (key === 'about' && !content.gallery?.length) errors.push('La galería debe contener al menos una imagen.')
  return errors
}

export function validateNews(item) {
  const errors = []
  ;['slug', 'category', 'level', 'date', 'title', 'excerpt', 'body', 'image', 'imageAlt'].forEach((field) => {
    if (!String(item?.[field] || '').trim()) errors.push(`El campo ${field} es obligatorio.`)
  })
  if (item?.title?.length > 140) errors.push('El título no puede superar 140 caracteres.')
  if (item?.excerpt?.length > 260) errors.push('El resumen no puede superar 260 caracteres.')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item?.slug || '')) errors.push('El slug solo admite minúsculas, números y guiones.')
  return errors
}
