import { useState } from 'react'
import { submitAdmissionRequest } from './cms/admissionService'
import { useContent } from './content/ContentContext'
import './admission.css'

const grades = ['Nido (desde 18 meses)', 'Inicial (3 a 5 años)', 'Primaria (6 a 11 años)', 'Secundaria (12 a 16 años)']
const campuses = ['Sede Trujillo', 'Sede Manuel Cedeño', 'Sede 22 de Febrero']
const emptyForm = { parent: '', email: '', phone: '', grade: '', campus: '' }

export default function Admission() {
  const { sections } = useContent()
  const content = sections.admission
  const [form, setForm] = useState(emptyForm)
  const [sentTo, setSentTo] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await submitAdmissionRequest(form)
      setSentTo(form.parent.trim().split(' ')[0])
      setForm(emptyForm)
    } catch (requestError) {
      console.error('No se pudo registrar la solicitud de admisión.', requestError)
      setError('No pudimos enviar tu solicitud. Inténtalo nuevamente en unos minutos.')
    } finally {
      setSubmitting(false)
    }
  }

  return <section className="admission-section" id="admision" aria-labelledby="admission-title">
    <div className="admission-decor" aria-hidden="true">
      <span className="admission-blob admission-blob-one" />
      <span className="admission-blob admission-blob-two" />
      <span className="admission-arc admission-arc-orange" />
      <span className="admission-arc admission-arc-light" />
      <span className="admission-arc admission-arc-bottom" />
    </div>
    <div className="admission-layout">
      <div className="admission-card">
        <span className="admission-card-glow" aria-hidden="true" />
        <p className="admission-kicker">{content.kicker}</p>
        <h1 id="admission-title">{content.title}</h1>
        {sentTo !== null
          ? <div className="admission-success" role="status">
              <span className="admission-success-icon" aria-hidden="true">✓</span>
              <h3>¡Gracias{sentTo ? `, ${sentTo}` : ''}!</h3>
              <p>Recibimos tu solicitud. Un asesor de admisión se pondrá en contacto contigo muy pronto.</p>
              <button type="button" onClick={() => setSentTo(null)}>Enviar otra solicitud</button>
            </div>
          : <form className="admission-form" onSubmit={submit}>
              <label><span className="sr-only">Nombre del padre o madre</span><input type="text" placeholder="Nombre del Padre/Madre" autoComplete="name" required value={form.parent} onChange={update('parent')} /></label>
              <label><span className="sr-only">Correo electrónico</span><input type="email" placeholder="Correo electrónico" autoComplete="email" required value={form.email} onChange={update('email')} /></label>
              <label><span className="sr-only">Teléfono de contacto</span><input type="tel" placeholder="Teléfono de contacto" autoComplete="tel" inputMode="tel" pattern="[0-9 +]{9,15}" title="Ingresa un número válido de 9 dígitos" required value={form.phone} onChange={update('phone')} /></label>
              <div className="admission-row">
                <label className="admission-select"><span className="sr-only">Grado de interés</span>
                  <select required value={form.grade} onChange={update('grade')} className={form.grade ? '' : 'is-empty'}>
                    <option value="" disabled>Grado de interés</option>
                    {grades.map((grade) => <option key={grade}>{grade}</option>)}
                  </select>
                </label>
                <label className="admission-select"><span className="sr-only">Sede de interés</span>
                  <select required value={form.campus} onChange={update('campus')} className={form.campus ? '' : 'is-empty'}>
                    <option value="" disabled>Sede</option>
                    {campuses.map((campus) => <option key={campus}>{campus}</option>)}
                  </select>
                </label>
              </div>
              {error && <p className="admission-error" role="alert">{error}</p>}
              <button className="admission-submit" type="submit" disabled={submitting}>{submitting ? 'Enviando…' : content.submitLabel} <span aria-hidden="true">→</span></button>
              <p className="admission-note">Un asesor se pondrá en contacto pronto.</p>
            </form>}
      </div>
      <figure className="admission-photo">
        <img src={content.image} alt={content.imageAlt} loading="lazy" decoding="async" />
        <figcaption>
          <strong>{content.imageKicker}</strong>
          <span>{content.imageCaption}</span>
        </figcaption>
      </figure>
    </div>
  </section>
}
