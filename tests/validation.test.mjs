import test from 'node:test'
import assert from 'node:assert/strict'
import { isSafeLink, validateImageFile, validateNews, validateSection } from '../src/cms/validation.js'

test('acepta enlaces internos y protocolos seguros', () => {
  assert.equal(isSafeLink('#niveles'), true)
  assert.equal(isSafeLink('/admision'), true)
  assert.equal(isSafeLink('https://paideia.edu.pe'), true)
  assert.equal(isSafeLink('javascript:alert(1)'), false)
})

test('valida formato y tamaño de imagen', () => {
  assert.equal(validateImageFile({ type: 'image/jpeg', size: 1024 }), null)
  assert.match(validateImageFile({ type: 'image/svg+xml', size: 1024 }), /JPEG/)
  assert.match(validateImageFile({ type: 'image/png', size: 11 * 1024 * 1024 }), /10 MB/)
})

test('una portada necesita campos y enlaces válidos', () => {
  const valid = { eyebrow: 'Etiqueta', title: 'Título', subtitle: 'Subtítulo', image: 'https://x.test/a.webp', imageAlt: 'Estudiante', primaryButton: { href: '#niveles' }, secondaryButton: { href: '#admision' } }
  assert.deepEqual(validateSection('hero', valid), [])
  assert.ok(validateSection('hero', { ...valid, title: '', primaryButton: { href: 'javascript:x' } }).length >= 2)
})

test('valida los campos editoriales de una noticia', () => {
  const news = { slug: 'noticia-valida', category: 'Eventos', level: 'General', date: 'OCT 2026', title: 'Título', excerpt: 'Resumen', body: 'Contenido', image: 'https://x.test/a.webp', imageAlt: 'Evento' }
  assert.deepEqual(validateNews(news), [])
  assert.ok(validateNews({ ...news, slug: 'Slug inválido', imageAlt: '' }).length >= 2)
})

test('valida apariencia y enlaces del footer', () => {
  const theme = { primaryColor: '#e09f12', accentColor: '#f47a1f', navyColor: '#12295c', backgroundColor: '#fafafa' }
  assert.deepEqual(validateSection('theme', theme), [])
  assert.ok(validateSection('theme', { ...theme, accentColor: 'naranja' }).length)
  const footer = { description: 'Texto', exploreTitle: 'Explora', locationsTitle: 'Sedes', contactTitle: 'Contacto', phoneLabel: '999', phoneHref: 'tel:+51999', email: 'hola@paideia.edu.pe', schedule: 'Lunes', copyrightName: 'Paideia', socials: [{ href: 'https://instagram.com' }], exploreLinks: [{ href: '#inicio' }], admissionButton: { href: '#admision' }, privacyHref: '#privacidad', termsHref: '#terminos' }
  assert.deepEqual(validateSection('footer', footer), [])
  assert.ok(validateSection('footer', { ...footer, email: 'correo-invalido' }).length)
})
