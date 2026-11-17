export const CROP_PRESETS = {
  landscape: { label: 'Noticia 16:10', aspect: 16 / 10, width: 1600, height: 1000 },
  square: { label: 'Cuadrada', aspect: 1, width: 1200, height: 1200 },
  portrait: { label: 'Retrato', aspect: 4 / 5, width: 1200, height: 1500 },
  gallery: { label: 'Galería 3:2', aspect: 3 / 2, width: 1800, height: 1200 },
  hero: { label: 'Portada 16:9', aspect: 16 / 9, width: 1920, height: 1080 },
}

const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image()
  image.onload = () => resolve(image)
  image.onerror = reject
  image.src = src
})

export async function cropToWebp(sourceUrl, crop, preset, quality = .84) {
  const image = await loadImage(sourceUrl)
  const canvas = document.createElement('canvas')
  const scale = Math.min(1, preset.width / crop.width, preset.height / crop.height)
  canvas.width = Math.max(1, Math.round(crop.width * scale))
  canvas.height = Math.max(1, Math.round(crop.height * scale))
  const context = canvas.getContext('2d')
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
  if (!blob) throw new Error('No se pudo procesar la imagen.')
  return { blob, width: canvas.width, height: canvas.height }
}
