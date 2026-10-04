import americaFacade from './assets/paideia america.png'
import cedenoFacade from './assets/paideia cedeño.png'
import febreroFacade from './assets/paideia 22 de febrero.png'
import './campuses-page.css'

const customCampusImages = import.meta.glob('./assets/sede-*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })

const imageFor = (slug, fallback) => Object.entries(customCampusImages).find(([path]) => path.includes(`sede-${slug}.`))?.[1] ?? fallback

const campuses = [
  { id: 'sede-trujillo', number: '01', city: 'Trujillo', name: 'Sede Trujillo', address: 'Av. América Sur 3845, Trujillo, Perú', reference: 'Frente al Jardín Botánico', description: 'Un espacio para aprender, crear y desarrollar grandes metas.', image: imageFor('trujillo', americaFacade), color: 'gold' },
  { id: 'sede-manuel-cedeno', number: '02', city: 'La Esperanza', name: 'Sede Manuel Cedeño', address: 'Jr. Manuel Cedeño 980, La Esperanza, Trujillo, Perú', reference: 'A 5 cuadras de la Plaza de Armas', description: 'Acompañamiento cercano para crecer con confianza y valores.', image: imageFor('manuel-cedeno', cedenoFacade), color: 'blue' },
  { id: 'sede-22-febrero', number: '03', city: 'La Esperanza', name: 'Sede 22 de Febrero', address: '22 de Febrero 623, La Esperanza, Trujillo, Perú', reference: 'A 2 cuadras de la Comisaría Bellavista', description: 'Una comunidad que impulsa talentos y sueños todos los días.', image: imageFor('22-febrero', febreroFacade), color: 'coral' },
]

function MapPin() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5.4-8 11-8 11S4 15.4 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.7" /></svg> }

export default function CampusesPage() {
  return <main className="campuses-page" id="sedes">
    <section className="campuses-page-hero" aria-labelledby="campuses-page-title">
      <span className="campuses-page-orbit" aria-hidden="true" />
      <span className="campuses-page-marker" aria-hidden="true"><MapPin /></span>
      <div className="campuses-page-hero-inner campuses-page-reveal">
        <p className="campuses-page-kicker">Siempre cerca de tu familia</p>
        <h1 id="campuses-page-title">Encuentra tu<br /><span>sede Paideia.</span></h1>
        <p>Tres espacios para aprender, descubrir y construir un gran futuro.</p>
        <div className="campuses-page-summary"><span><strong>3</strong>sedes</span><i aria-hidden="true" /><span>Trujillo y<br />La Esperanza</span></div>
      </div>
    </section>

    <section className="campuses-details" aria-label="Sedes Paideia">
      {campuses.map((campus, index) => {
        const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(campus.address)}&output=embed`
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(campus.address)}`
        return <article className={`campus-view-card campus-view-card-${campus.color} campuses-page-reveal`} id={campus.id} style={{ animationDelay: `${index * .12}s` }} key={campus.id}>
          <div className="campus-view-photo"><span className="campus-view-number">{campus.number}</span><img src={campus.image} alt={`Fachada de ${campus.name}`} /><span className="campus-view-curve" aria-hidden="true" /></div>
          <div className="campus-view-info">
            <p className="campus-view-city">{campus.city}</p>
            <span className="campus-view-eyebrow">Un lugar para crecer</span>
            <h2>{campus.name}</h2>
            <p className="campus-view-description">{campus.description}</p>
            <p className="campus-view-reference"><span aria-hidden="true">◆</span>Referencia: <strong>{campus.reference}</strong></p>
            <div className="campus-map-wrap">
              <iframe title={`Mapa de ${campus.name}`} src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <div className="campus-map-address"><MapPin /><span>{campus.address}</span></div>
            </div>
            <a className="campus-map-link" href={mapsLink} target="_blank" rel="noreferrer">Ver ubicación en Google Maps <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      })}
    </section>
  </main>
}
