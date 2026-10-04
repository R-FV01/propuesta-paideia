import { useEffect, useMemo, useRef, useState } from 'react'
import paradeImage from './assets/nosotros-comunidad-6.jpg'
import teachersImage from './assets/nosotros-comunidad-3.jpg'
import danceImage from './assets/nosotros-comunidad-4.jpg'
import playImage from './assets/nosotros-hero.jpg'
import readingImage from './assets/paideia faq.png'
import './news.css'

const categories = ['Todos', 'Académico', 'Eventos', 'Comunicados', 'Deportes y Arte']
const levels = ['Todos los niveles', 'Nido', 'Inicial', 'Primaria', 'Secundaria', 'General']
const PAGE_SIZE = 6

const news = [
  { id: 'desfile', category: 'Eventos', level: 'General', date: 'SEP 2026', title: 'Nuestra delegación brilló en el Desfile Cívico Escolar', excerpt: 'Estudiantes, docentes y familias recorrieron las calles con disciplina, alegría y mucho orgullo Paideia.', body: 'Con banderas en alto y paso firme, nuestra delegación participó en el Desfile Cívico Escolar. Escolta, banda y estudiantes de todos los niveles demostraron el compromiso, la puntualidad y el amor por el Perú que trabajamos cada día en el aula. ¡Gracias a las familias que nos acompañaron!', image: paradeImage, featured: true },
  { id: 'admision', category: 'Comunicados', level: 'General', date: 'OCT 2026', title: 'Proceso de Admisión 2027: vacantes abiertas', excerpt: 'Conoce los pasos, requisitos y fechas para asegurar la vacante de tu hijo.', body: 'Iniciamos el Proceso de Admisión 2027 para Nido, Inicial, Primaria y Secundaria en nuestras tres sedes. Completa el formulario de admisión y un asesor te contactará para agendar una visita guiada, una entrevista familiar y resolver todas tus dudas. Las vacantes son limitadas.', cover: 'admission' },
  { id: 'psicomotricidad', category: 'Académico', level: 'Inicial', date: 'SEP 2026', title: 'Taller de juego y psicomotricidad en Inicial', excerpt: 'Aprender moviéndose: coordinación, equilibrio y trabajo en equipo.', body: 'Nuestros pequeños de Inicial vivieron una mañana de circuitos, aros y pelotas para fortalecer su coordinación, su equilibrio y su confianza. El juego dirigido es una de las herramientas que usamos para que aprendan explorando.', image: playImage },
  { id: 'cronograma', category: 'Comunicados', level: 'General', date: 'OCT 2026', title: 'Cronograma de actividades de octubre', excerpt: 'Reuniones de padres, jornadas pedagógicas y fechas importantes del mes.', body: 'Compartimos el cronograma de octubre: reuniones de padres por nivel, entrega de informes de progreso, jornada pedagógica y actividades por el Mes de la Canción Criolla. Revisa la agenda de tu hijo y mantente atento a nuestros canales oficiales.', cover: 'calendar' },
  { id: 'ajedrez', category: 'Deportes y Arte', level: 'Secundaria', date: 'NOV 2026', title: 'Resultados del Torneo Interescolar de Ajedrez', excerpt: 'Estrategia, concentración y juego limpio en cada partida.', body: 'Nuestro equipo de ajedrez de Secundaria compitió en el Torneo Interescolar demostrando concentración, estrategia y deportividad. Felicitamos a todos los participantes y a sus entrenadores por representar a Paideia con excelencia.', cover: 'chess' },
  { id: 'maestro', category: 'Eventos', level: 'General', date: 'JUL 2026', title: 'Celebramos el Día del Maestro', excerpt: 'Un homenaje a quienes inspiran, guían y acompañan cada día.', body: 'Nuestra comunidad rindió homenaje a los docentes Paideia con una ceremonia llena de gratitud. Gracias por enseñar con vocación, paciencia y cariño, y por creer en el futuro de cada estudiante.', image: teachersImage },
  { id: 'danza', category: 'Deportes y Arte', level: 'Secundaria', date: 'AGO 2026', title: 'Danza y marcha: talento en cada paso', excerpt: 'Nuestras estudiantes se lucieron con una coreografía llena de ritmo.', body: 'Las estudiantes de Secundaria presentaron una coreografía preparada durante semanas en los talleres de arte. Disciplina, coordinación y mucho entusiasmo en cada paso.', image: danceImage },
  { id: 'lectura', category: 'Académico', level: 'Secundaria', date: 'AGO 2026', title: 'Semana de la lectura y la escritura', excerpt: 'Círculos de lectura, cuentos propios y debates en cada aula.', body: 'Durante la Semana de la Lectura, nuestros estudiantes participaron en círculos literarios, escribieron sus propios relatos y debatieron sobre sus libros favoritos. Leer nos ayuda a pensar, imaginar y comprender el mundo.', image: readingImage },
]

function NewsCover({ type }) {
  if (type === 'admission') return <svg className="news-cover news-cover-admission" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Portada Admisión 2027">
    <rect width="320" height="200" fill="#12295c" />
    <circle cx="300" cy="10" r="90" fill="#f47a1f" />
    <circle cx="300" cy="10" r="60" fill="none" stroke="#fde9d6" strokeWidth="1.5" />
    <circle cx="20" cy="210" r="70" fill="#1b4d9a" />
    <text x="26" y="92" fill="#fff" fontFamily="Fraunces, Georgia, serif" fontSize="34" fontWeight="600">Proceso</text>
    <text x="26" y="132" fill="#ffb26b" fontFamily="Fraunces, Georgia, serif" fontSize="34" fontWeight="600">Admisión 2027</text>
    <rect x="26" y="148" width="128" height="22" rx="11" fill="#f47a1f" />
    <text x="90" y="163" fill="#fff" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" fontWeight="700" textAnchor="middle">¡VACANTES ABIERTAS!</text>
  </svg>
  if (type === 'calendar') return <svg className="news-cover" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Portada cronograma de octubre">
    <rect width="320" height="200" fill="#fde9d6" />
    <circle cx="40" cy="30" r="60" fill="#fbd7b3" />
    <circle cx="290" cy="180" r="50" fill="#f9c99a" />
    <g transform="translate(98 56)">
      <rect width="124" height="128" rx="14" fill="#fff" stroke="#12295c" strokeWidth="3" />
      <path d="M0 14a14 14 0 0 1 14-14h96a14 14 0 0 1 14 14v22H0Z" fill="#f47a1f" />
      <rect x="28" y="-10" width="8" height="22" rx="4" fill="#12295c" />
      <rect x="88" y="-10" width="8" height="22" rx="4" fill="#12295c" />
      <text x="62" y="27" fill="#fff" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="13" fontWeight="800" textAnchor="middle">OCTUBRE</text>
      {Array.from({ length: 15 }, (_, i) => <rect key={i} x={14 + (i % 5) * 20} y={50 + Math.floor(i / 5) * 24} width="14" height="14" rx="3" fill={i === 7 ? '#f47a1f' : i === 11 ? '#12295c' : '#e7ebf3'} />)}
    </g>
    <g transform="translate(222 150)"><circle r="22" fill="#12295c" /><path d="M-9 -2h6l9-7v18l-9-7h-6Z" fill="#fff" /><path d="M10 -6q5 6 0 12" stroke="#fff" strokeWidth="2" fill="none" /></g>
  </svg>
  return <svg className="news-cover" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Portada torneo de ajedrez">
    <defs><pattern id="board" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#f6e4c8" /><rect width="20" height="20" fill="#c98b4a" /><rect x="20" y="20" width="20" height="20" fill="#c98b4a" /></pattern></defs>
    <rect width="320" height="200" fill="#1a1f2e" />
    <path d="M0 150 L320 120 L320 200 L0 200Z" fill="url(#board)" opacity=".9" />
    <circle cx="250" cy="50" r="70" fill="#f47a1f" opacity=".18" />
    <g fill="#fff" stroke="#12295c" strokeWidth="2">
      <path d="M118 140h44l-5-12h-34Z" /><path d="M126 128c-2-18 4-26 0-36 8-4 20-4 28 0-4 10 2 18 0 36Z" /><circle cx="140" cy="84" r="9" /><path d="M136 70h8M140 66v8" strokeLinecap="round" />
    </g>
    <g fill="#12295c" stroke="#f6e4c8" strokeWidth="2">
      <path d="M180 144h40l-4-10h-32Z" /><path d="M186 134c0-14 2-20-2-30l10-14c8 2 14 8 16 16l-6 4 4 24Z" /><circle cx="198" cy="98" r="2" fill="#f6e4c8" />
    </g>
    <g fill="#f47a1f" stroke="#fff" strokeWidth="1.5"><path d="M86 150h26l-3-8H89Z" /><path d="M92 142c0-8 2-12 0-18h16c-2 6 0 10 0 18Z" /><circle cx="100" cy="118" r="7" /></g>
  </svg>
}

function NewsMedia({ item }) {
  return item.image
    ? <img src={item.image} alt="" loading="lazy" decoding="async" />
    : <NewsCover type={item.cover} />
}

function Tag({ item }) {
  return <span className="news-tag">{item.category} • {item.level}</span>
}

export default function News() {
  const [category, setCategory] = useState('Todos')
  const [level, setLevel] = useState('Todos los niveles')
  const [visible, setVisible] = useState(PAGE_SIZE + 1)
  const [openItem, setOpenItem] = useState(null)
  const dialogRef = useRef(null)

  const filtered = useMemo(() => news.filter((item) =>
    (category === 'Todos' || item.category === category) &&
    (level === 'Todos los niveles' || item.level === level)), [category, level])

  const [featured, ...rest] = filtered
  const shown = rest.slice(0, visible - 1)

  useEffect(() => { setVisible(PAGE_SIZE + 1) }, [category, level])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (openItem && !dialog.open) dialog.showModal()
    if (!openItem && dialog.open) dialog.close()
  }, [openItem])

  return <section className="news-section" id="noticias" aria-labelledby="news-title">
    <span className="news-ornament news-ornament-left" aria-hidden="true" />
    <span className="news-ornament news-ornament-right" aria-hidden="true" />
    <div className="news-inner">
      <div className="news-head">
        <div>
          <p className="news-kicker">Vida Paideia</p>
          <h1 id="news-title">Noticias y novedades <span>Paideia</span></h1>
        </div>
        <label className="news-level">
          <span>Filtrar por nivel</span>
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            {levels.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
      </div>

      <div className="news-categories" role="group" aria-label="Categorías de noticias">
        {categories.map((option) => <button type="button" className={category === option ? 'is-active' : ''} aria-pressed={category === option} onClick={() => setCategory(option)} key={option}>{option}</button>)}
      </div>

      {featured
        ? <div className="news-grid" key={`${category}-${level}`}>
            <article className="news-featured">
              <button type="button" className="news-card-button" onClick={() => setOpenItem(featured)} aria-label={`Leer: ${featured.title}`} />
              <div className="news-media"><NewsMedia item={featured} /><Tag item={featured} /><span className="news-date">{featured.category} / {featured.date}</span></div>
              <div className="news-featured-body">
                <span className="news-badge">Noticia destacada</span>
                <h3>{featured.title}</h3>
                <p>{featured.excerpt}</p>
                <span className="news-read">Leer noticia completa <span aria-hidden="true">→</span></span>
              </div>
            </article>
            {shown.map((item, index) => <article className="news-card" style={{ animationDelay: `${index * 60}ms` }} key={item.id}>
              <button type="button" className="news-card-button" onClick={() => setOpenItem(item)} aria-label={`Leer: ${item.title}`} />
              <div className="news-media"><NewsMedia item={item} /><Tag item={item} /></div>
              <div className="news-card-body">
                <time>{item.date}</time>
                <h3>{item.title}</h3>
                <span className="news-read">Ver más <span aria-hidden="true">→</span></span>
              </div>
            </article>)}
          </div>
        : <div className="news-empty" role="status">
            <strong>Aún no hay noticias con estos filtros.</strong>
            <button type="button" onClick={() => { setCategory('Todos'); setLevel('Todos los niveles') }}>Ver todas las noticias</button>
          </div>}

      {rest.length > shown.length && <div className="news-more"><button type="button" onClick={() => setVisible((current) => current + PAGE_SIZE)}>Cargar más noticias</button></div>}
    </div>

    <dialog className="news-dialog" ref={dialogRef} onClose={() => setOpenItem(null)} onClick={(event) => { if (event.target === event.currentTarget) setOpenItem(null) }}>
      {openItem && <article>
        <div className="news-dialog-media"><NewsMedia item={openItem} /></div>
        <div className="news-dialog-body">
          <Tag item={openItem} />
          <time>{openItem.date}</time>
          <h3>{openItem.title}</h3>
          <p>{openItem.body}</p>
          <button type="button" onClick={() => setOpenItem(null)}>Cerrar</button>
        </div>
        <button type="button" className="news-dialog-close" onClick={() => setOpenItem(null)} aria-label="Cerrar noticia">×</button>
      </article>}
    </dialog>
  </section>
}
