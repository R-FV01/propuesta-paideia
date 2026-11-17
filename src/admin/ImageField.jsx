import { useState } from 'react'
import MediaLibrary from './MediaLibrary'

export default function ImageField({ label, value, alt, onChange }) {
  const [open, setOpen] = useState(false)
  return <div className="admin-image-field"><span>{label}</span><div>{value && <img src={value} alt={alt || ''} />}<button type="button" className="admin-button ghost" onClick={() => setOpen(true)}>{value ? 'Cambiar imagen' : 'Elegir imagen'}</button></div>{open && <div className="admin-modal" role="dialog" aria-modal="true" aria-label="Seleccionar imagen"><div className="admin-modal-panel"><header><h2>Biblioteca multimedia</h2><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar">×</button></header><MediaLibrary selectable selectedUrl={value} onSelect={(asset) => { onChange(asset.public_url, asset.alt_text); setOpen(false) }} /></div></div>}</div>
}
