import { useContent } from './content/ContentContext'
import './campuses-page.css'

function MapPin() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5.4-8 11-8 11S4 15.4 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.7" /></svg> }

export default function CampusesPage() {
  const { sections } = useContent()
  const content = sections.campuses
  const campuses = content.items
  return <main className="campuses-page" id="sedes">
    <section className="campuses-page-hero" aria-labelledby="campuses-page-title">
      <span className="campuses-page-orbit" aria-hidden="true" />
      <span className="campuses-page-marker" aria-hidden="true"><MapPin /></span>
      <div className="campuses-page-hero-inner campuses-page-reveal">
        <p className="campuses-page-kicker">{content.kicker}</p>
        <h1 id="campuses-page-title">{content.title}</h1>
        <p>{content.intro}</p>
        <div className="campuses-page-summary"><span><strong>3</strong>sedes</span><i aria-hidden="true" /><span>Trujillo y<br />La Esperanza</span></div>
      </div>
    </section>

    <section className="campuses-details" aria-label="Sedes Paideia">
      {campuses.map((campus, index) => {
        const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(campus.fullAddress)}&output=embed`
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(campus.fullAddress)}`
        return <article className={`campus-view-card campus-view-card-${campus.color} campuses-page-reveal`} id={campus.id} style={{ animationDelay: `${index * .12}s` }} key={campus.id}>
          <div className="campus-view-photo"><span className="campus-view-number">{campus.number}</span><img src={campus.image} alt={campus.imageAlt} loading="lazy" decoding="async" /><span className="campus-view-curve" aria-hidden="true" /></div>
          <div className="campus-view-info">
            <p className="campus-view-city">{campus.district}</p>
            <span className="campus-view-eyebrow">Un lugar para crecer</span>
            <h2>{campus.name}</h2>
            <p className="campus-view-description">{campus.detail}</p>
            <p className="campus-view-reference"><span aria-hidden="true">◆</span>Referencia: <strong>{campus.reference}</strong></p>
            <div className="campus-map-wrap">
              <iframe title={`Mapa de ${campus.name}`} src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <div className="campus-map-address"><MapPin /><span>{campus.fullAddress}</span></div>
            </div>
            <a className="campus-map-link" href={mapsLink} target="_blank" rel="noreferrer">Ver ubicación en Google Maps <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      })}
    </section>
  </main>
}
