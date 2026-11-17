import { useEffect, useState } from 'react'
import Cropper from 'react-easy-crop'
import { CROP_PRESETS, cropToWebp } from '../cms/image'
import { uploadMedia } from '../cms/mediaService'
import { validateImageFile } from '../cms/validation'

export default function ImageUploader({ onUploaded, defaultPreset = 'landscape' }) {
  const [source, setSource] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pixels, setPixels] = useState(null)
  const [presetKey, setPresetKey] = useState(defaultPreset)
  const [altText, setAltText] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const preset = CROP_PRESETS[presetKey]
  useEffect(() => () => { if (source) URL.revokeObjectURL(source) }, [source])
  const chooseFile = (event) => {
    const file = event.target.files?.[0]
    const validationError = validateImageFile(file)
    if (validationError) { setError(validationError); return }
    if (source) URL.revokeObjectURL(source)
    setSource(URL.createObjectURL(file)); setError('')
  }
  const submit = async () => {
    if (!pixels || !altText.trim()) { setError('Define el recorte y un texto alternativo.'); return }
    setBusy(true); setError('')
    try {
      const processed = await cropToWebp(source, pixels, preset)
      const asset = await uploadMedia({ ...processed, altText: altText.trim(), focalX: 50, focalY: 50 })
      onUploaded(asset); setSource(''); setAltText(''); setZoom(1); setCrop({ x: 0, y: 0 })
    } catch (uploadError) { setError(uploadError.message) } finally { setBusy(false) }
  }
  return <div className="admin-uploader">
    {!source && <label className="admin-dropzone"><strong>Subir una imagen</strong><span>JPEG, PNG o WebP · máximo 10 MB</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} /></label>}
    {source && <><div className="admin-crop-stage"><Cropper image={source} crop={crop} zoom={zoom} aspect={preset.aspect} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, value) => setPixels(value)} /></div><div className="admin-crop-controls"><label>Formato<select value={presetKey} onChange={(event) => setPresetKey(event.target.value)}>{Object.entries(CROP_PRESETS).map(([key, value]) => <option value={key} key={key}>{value.label}</option>)}</select></label><label>Zoom<input type="range" min="1" max="3" step=".05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label><label className="admin-field-wide">Texto alternativo<input value={altText} maxLength="180" onChange={(event) => setAltText(event.target.value)} placeholder="Describe lo que aparece en la imagen" /></label></div><div className="admin-actions"><button type="button" className="admin-button ghost" onClick={() => setSource('')}>Cancelar</button><button type="button" className="admin-button" disabled={busy} onClick={submit}>{busy ? 'Procesando…' : 'Recortar y subir'}</button></div></>}
    {error && <p className="admin-error" role="alert">{error}</p>}
  </div>
}
