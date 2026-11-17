import { useEffect, useState } from 'react'
import { listMedia, removeMedia } from '../cms/mediaService'
import ImageUploader from './ImageUploader'

export default function MediaLibrary({ selectable = false, onSelect, selectedUrl }) {
  const [assets, setAssets] = useState([])
  const [status, setStatus] = useState('Cargando…')
  const load = async () => { try { const data = await listMedia(); setAssets(data); setStatus(data.length ? '' : 'Aún no hay imágenes subidas.') } catch (error) { setStatus(error.message) } }
  useEffect(() => { load() }, [])
  const handleDelete = async (asset) => {
    if (!window.confirm(`¿Eliminar "${asset.alt_text}"? Esta acción no se puede deshacer.`)) return
    try { await removeMedia(asset); await load() } catch (error) { window.alert(error.message) }
  }
  return <div className="admin-media-library"><ImageUploader onUploaded={(asset) => { setAssets((current) => [asset, ...current]); if (selectable) onSelect(asset) }} />{status && <p className="admin-muted">{status}</p>}<div className="admin-media-grid">{assets.map((asset) => <article className={`admin-media-card ${selectedUrl === asset.public_url ? 'is-selected' : ''}`} key={asset.id}><button type="button" className="admin-media-preview" onClick={() => selectable && onSelect(asset)} aria-label={`Seleccionar ${asset.alt_text}`}><img src={asset.public_url} alt={asset.alt_text} /></button><div><strong>{asset.alt_text}</strong><small>{asset.width} × {asset.height} · {Math.round(asset.size_bytes / 1024)} KB</small></div><button type="button" className="admin-icon-button danger" onClick={() => handleDelete(asset)} aria-label="Eliminar imagen">×</button></article>)}</div></div>
}
