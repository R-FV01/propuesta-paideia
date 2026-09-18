import { useEffect, useRef, useState } from 'react'
import heroSchool from './assets/hero-school.png'
import nidoImage from './assets/nido.jpg'
import inicialImage from './assets/inicial.jpg'
import primariaImage from './assets/primaria.jpg'
import secundariaImage from './assets/secundaria.jpg'
import WhyChooseUs from './WhyChooseUs'
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions'
import Footer from './Footer'
import AboutPage from './AboutPage'
import CampusesPage from './CampusesPage'
import americaFacade from './assets/paideia america.png'
import cedenoFacade from './assets/paideia cedeño.png'
import febreroFacade from './assets/paideia 22 de febrero.png'

const navigation = [
  { label: 'Inicio', href: '#inicio' },
  {
    label: 'Propuesta educativa',
    children: [
      { label: 'Niveles', href: '#niveles' },
      { label: 'Nuestro enfoque', href: '#por-que-elegirnos' },
    ],
  },
  {
    label: 'Vida Paideia',
    children: [
      { label: 'Sedes', href: '#sedes' },
      { label: 'Noticias', href: '#noticias' },
    ],
  },
  { label: 'Nosotros', href: '#nosotros' },
]

const features = [
  { title: <>Docentes<br />capacitados</>, text: 'Un equipo que inspira, guía y acompaña el potencial de cada estudiante.', type: 'cap' },
  { title: <>Cursos<br />interactivos</>, text: 'Experiencias dinámicas que convierten la curiosidad en aprendizaje real.', type: 'course' },
  { title: <>Aprendizaje<br />asegurado</>, text: 'Una formación cercana para avanzar con confianza hacia cada meta.', type: 'book' },
]

const schoolLevels = [
  { number: '01', name: 'Nido', age: 'Desde los 18 meses', image: nidoImage, color: '#1596d0', soft: '#dff4ff', text: 'Un primer espacio seguro, alegre y lleno de descubrimientos. Acompañamos cada paso con afecto, juego y experiencias que despiertan su curiosidad natural.' },
  { number: '02', name: 'Inicial', age: '3 a 5 años', image: inicialImage, color: '#ef7827', soft: '#fff0df', text: 'Aprender haciendo, creando y compartiendo. Fortalecemos su autonomía y confianza para que conviertan cada pregunta en una nueva posibilidad.' },
  { number: '03', name: 'Primaria', age: '6 a 11 años', image: primariaImage, color: '#46a870', soft: '#e5f6e9', text: 'Construimos bases sólidas para aprender con entusiasmo. Combinamos acompañamiento cercano, pensamiento crítico y una formación con propósito.' },
  { number: '04', name: 'Secundaria', age: '12 a 16 años', image: secundariaImage, color: '#5142a4', soft: '#ebe9ff', text: 'Impulsamos líderes capaces de tomar decisiones, asumir retos y proyectar su futuro con seguridad, valores y una mirada global.' },
]

const campuses = [
  { id: 'sede-trujillo', number: '01', name: 'Sede Trujillo', district: 'Trujillo', address: 'Av. América Sur 3845', detail: 'Un espacio para aprender, crear y desarrollar grandes metas.', color: 'gold' },
  { id: 'sede-manuel-cedeno', number: '02', name: 'Sede Manuel Cedeño', district: 'La Esperanza', address: 'Jr. Manuel Cedeño 980', detail: 'Acompañamiento cercano para crecer con confianza y valores.', color: 'blue' },
  { id: 'sede-22-febrero', number: '03', name: 'Sede 22 de Febrero', district: 'La Esperanza', address: '22 de Febrero 623', detail: 'Una comunidad que impulsa talentos y sueños todos los días.', color: 'coral' },
]

function Brand() {
  return <a className="brand" href="#inicio" aria-label="Paideia College">
    <span>Paideia</span><small>College</small>
  </a>
}

function Icon({ type }) {
  if (type === 'cap') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m2.5 8 9.5-4 9.5 4-9.5 4-9.5-4Z" /><path d="M6 10.2v4.1c2.7 2.3 9.3 2.3 12 0v-4.1M21.5 8v6" /><path d="M20.5 15.5h2l.6 2h-3.2l.6-2Z" /></svg>
  if (type === 'course') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4V2m6 2V2M9 12h6m-6 4h4" /><circle cx="12" cy="8" r="1" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5h13.5v16H5c-1.1 0-2 .9-2 2h15.5" /><path d="M5 3.5v18M8 17h7" /></svg>
}

function LocationIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5.4-8 11-8 11S4 15.4 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.7" /></svg>
}

function NavigationItems({ activeLink, expandedMenu, setExpandedMenu, mobile = false, onNavigate }) {
  return navigation.map((item) => {
    if (!item.children) return <a className={activeLink === item.label ? 'is-current' : ''} href={item.href} onClick={() => onNavigate(item.label)} key={item.label}>{item.label}</a>

    const isOpen = expandedMenu === item.label
    return <div className={`nav-group ${isOpen ? 'is-open' : ''} ${activeLink === item.label ? 'is-current' : ''}`} key={item.label}>
      <button className="nav-parent" type="button" aria-expanded={isOpen} onClick={() => setExpandedMenu(isOpen ? null : item.label)}>
        {item.label}<span className="nav-chevron" aria-hidden="true" />
      </button>
      <div className="nav-dropdown">
        {item.children.map((child) => <a href={child.href} onClick={() => onNavigate(item.label)} key={child.label}>{child.label}<span aria-hidden="true">→</span></a>)}
      </div>
    </div>
  })
}

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState('Inicio')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState(null)

  useEffect(() => {
    const updateHeader = () => {
      setIsScrolled(window.scrollY > 18)
      if (window.location.hash === '#nosotros') {
        setActiveLink('Nosotros')
        return
      }
      if (window.location.hash === '#sedes' || window.location.hash.startsWith('#sede-')) {
        setActiveLink('Vida Paideia')
        return
      }
      const sections = [
        { id: 'niveles', label: 'Propuesta educativa' },
        { id: 'sedes-inicio', label: 'Vida Paideia' },
        { id: 'por-que-elegirnos', label: 'Nosotros' },
      ]
      const activeSection = sections.find(({ id }) => document.getElementById(id)?.getBoundingClientRect().top < window.innerHeight * .45)
      setActiveLink(activeSection?.label ?? 'Inicio')
    }
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    window.addEventListener('hashchange', updateHeader)
    return () => {
      window.removeEventListener('scroll', updateHeader)
      window.removeEventListener('hashchange', updateHeader)
    }
  }, [])

  const navigate = (label) => {
    setActiveLink(label)
    setIsMenuOpen(false)
    setExpandedMenu(null)
  }

  return <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
    <div className="nav-shell">
      <Brand />
      <nav className="desktop-nav" aria-label="Navegación principal">
        <NavigationItems activeLink={activeLink} expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} onNavigate={navigate} />
      </nav>
      <div className="nav-actions">
        <a className="contact-link" href="#contacto">Contacto</a>
        <a className="admission-link" href="#admision">Admisión 2027 <span className="admission-arrow" aria-hidden="true">→</span></a>
        <button className={`menu-button ${isMenuOpen ? 'is-open' : ''}`} type="button" aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => { if (open) setExpandedMenu(null); return !open })}><span></span><span></span><span></span></button>
      </div>
    </div>
    <nav className={`mobile-menu ${isMenuOpen ? 'is-open' : ''}`} aria-label="Navegación móvil">
      <NavigationItems mobile activeLink={activeLink} expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} onNavigate={navigate} />
      <div className="mobile-menu-actions"><a href="#contacto" onClick={() => navigate('Contacto')}>Contacto</a><a href="#admision" onClick={() => navigate('Admisión 2027')}>Admisión 2027 <span aria-hidden="true">→</span></a></div>
    </nav>
  </header>
}

function FeatureCard({ title, text, type }) {
  return <article className="feature-card">
    <div className="feature-icon"><Icon type={type} /></div>
    <h2>{title}</h2>
    <span className="feature-rule" />
    <p>{text}</p>
  </article>
}

function Hero() {
  return <div className="landing-intro">
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="eyebrow">El mejor colegio para tus hijos</p>
        <h1 id="hero-heading">En Paideia<br />formamos líderes</h1>
        <p className="subtitle">Preparados para el futuro</p>
        <div className="hero-buttons">
          <a className="button button-primary" href="#matricula">Matricúlate ya</a>
          <a className="button button-secondary" href="#conocenos">Conócenos</a>
        </div>
      </div>
      <div className="hero-art">
        <img src={heroSchool} alt="Estudiante graduada con una manzana y libros" />
      </div>
    </section>
    <section className="features" aria-label="Beneficios de Paideia">
      <div className="features-grid">
        {features.map((feature) => <FeatureCard key={feature.type} {...feature} />)}
      </div>
    </section>
  </div>
}

function Levels() {
  const [activeLevel, setActiveLevel] = useState(0)
  const levelRefs = useRef([])

  useEffect(() => {
    let animationFrame
    const updateActiveLevel = () => {
      animationFrame = undefined
      const viewportCenter = window.innerHeight / 2
      let closestIndex = 0
      let smallestDistance = Number.POSITIVE_INFINITY

      levelRefs.current.forEach((element, index) => {
        if (!element) return
        const bounds = element.getBoundingClientRect()
        const elementCenter = bounds.top + bounds.height / 2
        const distance = Math.abs(elementCenter - viewportCenter)
        if (distance < smallestDistance) {
          smallestDistance = distance
          closestIndex = index
        }
      })
      setActiveLevel((current) => current === closestIndex ? current : closestIndex)
    }
    const requestUpdate = () => {
      if (animationFrame === undefined) animationFrame = window.requestAnimationFrame(updateActiveLevel)
    }

    updateActiveLevel()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <section className="levels-section" id="niveles" aria-labelledby="levels-heading">
    <div className="levels-intro">
      <p className="section-kicker">Una educación para cada etapa</p>
      <h2 id="levels-heading">El camino para<br />crecer y liderar</h2>
      <p>En Paideia acompañamos a cada estudiante con una educación cercana, retadora y diseñada para su momento de vida.</p>
    </div>
    <div className="levels-layout">
      <div className="levels-list">
        {schoolLevels.map((level, index) => <article className={`level-item ${activeLevel === index ? 'is-active' : ''}`} style={{ '--level-color': level.color, '--level-soft': level.soft }} data-level={index} key={level.name} ref={(element) => { levelRefs.current[index] = element }}>
          <span className="level-number">{level.number}</span>
          <div className="level-content">
            <p className="level-age">{level.age}</p>
            <h3>{level.name}</h3>
            <p>{level.text}</p>
          </div>
          <img className="level-mobile-image" src={level.image} alt={`Nivel ${level.name} de Paideia`} />
        </article>)}
      </div>
      <div className="level-visual" style={{ '--visual-color': schoolLevels[activeLevel].color, '--visual-soft': schoolLevels[activeLevel].soft }} aria-live="polite">
        {schoolLevels.map((level, index) => <img className={activeLevel === index ? 'is-active' : ''} src={level.image} alt={activeLevel === index ? `Nivel ${level.name} de Paideia` : ''} aria-hidden={activeLevel !== index} key={level.name} />)}
      </div>
    </div>
  </section>
}

function Campuses() {
  return <section className="campuses-section" id="sedes-inicio" aria-labelledby="campuses-heading">
    <div className="campuses-motion" aria-hidden="true">
      <span className="campuses-orbit" />
      <span className="campuses-pin"><LocationIcon /></span>
    </div>
    <div className="campuses-heading">
      <p className="section-kicker">Siempre cerca de tu familia</p>
      <h2 id="campuses-heading">Encuentra tu sede<br />Paideia</h2>
      <p>Tres espacios para aprender, descubrir y construir un gran futuro.</p>
    </div>
    <div className="campuses-grid">
      {campuses.map((campus) => <article className={`campus-card campus-${campus.color}`} key={campus.name}>
        <div className="campus-photo">
          <span className="campus-district"><LocationIcon />{campus.district}</span>
          <img src={{ gold: americaFacade, blue: cedenoFacade, coral: febreroFacade }[campus.color]} alt={`Fachada de ${campus.name}, Paideia`} loading="lazy" decoding="async" />
        </div>
        <div className="campus-body">
        <span className="campus-eyebrow">Un lugar para crecer</span>
        <h3>{campus.name}</h3>
        <address><LocationIcon />{campus.address}</address>
        <p className="campus-detail">{campus.detail}</p>
        <a className="campus-link" href={`#${campus.id}`} aria-label={`Conoce más sobre ${campus.name}`}>Conoce más <span aria-hidden="true">→</span></a>
        </div>
      </article>)}
    </div>
  </section>
}

export default function App() {
  const getView = () => window.location.hash === '#nosotros' ? 'about' : (window.location.hash === '#sedes' || window.location.hash.startsWith('#sede-')) ? 'campuses' : 'home'
  const [view, setView] = useState(getView)

  useEffect(() => {
    const updateView = () => setView(getView())
    window.addEventListener('hashchange', updateView)
    return () => window.removeEventListener('hashchange', updateView)
  }, [])

  useEffect(() => {
    const anchor = window.location.hash.slice(1)
    requestAnimationFrame(() => {
      const target = document.getElementById(anchor)
      if (target) target.scrollIntoView()
      else window.scrollTo({ top: 0 })
    })
  }, [view])

  return <><Header />{view === 'about' ? <AboutPage /> : view === 'campuses' ? <CampusesPage /> : <main id="inicio"><Hero /><Levels /><Campuses /><WhyChooseUs /><FrequentlyAskedQuestions /></main>}<Footer /></>
}
