const DEFAULT_NUMBER = '51908805756'

// Construye un enlace wa.me con un mensaje prellenado.
export function whatsappLink(global = {}, message) {
  const number = String(global.whatsappNumber || DEFAULT_NUMBER).replace(/\D/g, '') || DEFAULT_NUMBER
  const text = message || global.whatsappMessage || ''
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}
