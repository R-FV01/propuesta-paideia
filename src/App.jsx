import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Home from './Home'
import Footer from './Footer'
import News from './News'
import Admission from './Admission'
import AboutPage from './AboutPage'
import CampusesPage from './CampusesPage'
import { useContent } from './content/ContentContext'
import logoLight from './assets/logo-paideia-light.png'

const AdminApp = lazy(() => import('./admin/AdminApp'))

const createNavigation = (content) => [
  { id: 'home', label: content.homeLabel, href: '#inicio' },
  { id: 'about', label: content.aboutLabel, href: '#nosotros' },
  {
    id: 'education', label: content.educationLabel,
    children: [
      { label: content.levelsLabel, href: '#niveles' },
      { label: content.approachLabel, href: '#por-que-elegirnos' },
    ],
  },
  {
    id: 'life', label: content.lifeLabel,
    children: [
      { label: content.campusesLabel, href: '#sedes' },
      { label: content.newsLabel, href: '#noticias' },
    ],
  },
]

function Brand({ content }) {
  return <a className="brand" href="#inicio" aria-label={`${content.brandName} ${content.brandSubtitle}, ir al inicio`}>
    <img src={logoLight} alt="" width="685" height="231" />
  </a>
}

function NavigationItems({ navigation, activeLink, expandedMenu, setExpandedMenu, mobile = false, onNavigate }) {
  return navigation.map((item) => {
    if (!item.children) return <a className={activeLink === item.id ? 'is-current' : ''} href={item.href} onClick={() => onNavigate(item.id)} key={item.id}>{item.label}</a>

    const isOpen = expandedMenu === item.label
    return <div className={`nav-group ${isOpen ? 'is-open' : ''} ${activeLink === item.id ? 'is-current' : ''}`} key={item.id}>
      <button className="nav-parent" type="button" aria-expanded={isOpen} onClick={() => setExpandedMenu(isOpen ? null : item.label)}>
        {item.label}<span className="nav-chevron" aria-hidden="true" />
      </button>
      <div className="nav-dropdown">
        {item.children.map((child) => <a href={child.href} onClick={() => onNavigate(item.id)} key={child.label}>{child.label}<span aria-hidden="true">→</span></a>)}
      </div>
    </div>
  })
}

function Header() {
  const { sections } = useContent()
  const content = sections.global
  const navigation = createNavigation(content)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState(null)

  useEffect(() => {
    const updateHeader = () => {
      setIsScrolled(window.scrollY > 18)
      if (window.location.hash === '#nosotros') {
        setActiveLink('about')
        return
      }
      if (window.location.hash === '#sedes' || window.location.hash.startsWith('#sede-') || window.location.hash === '#noticias') {
        setActiveLink('life')
        return
      }
      if (window.location.hash === '#admision') {
        setActiveLink('admission')
        return
      }
      const sections = [
        { id: 'por-que-elegirnos', label: 'education' },
        { id: 'proceso-admision', label: 'admission' },
        { id: 'niveles', label: 'education' },
      ]
      const activeSection = sections.findLast(({ id }) => document.getElementById(id)?.getBoundingClientRect().top < window.innerHeight * .45)
      setActiveLink(activeSection?.label ?? 'home')
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
      <Brand content={content} />
      <nav className="desktop-nav" aria-label="Navegación principal">
        <NavigationItems navigation={navigation} activeLink={activeLink} expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} onNavigate={navigate} />
      </nav>
      <div className="nav-actions">
        <a className="contact-link" href="#contacto">{content.contactLabel}</a>
        <a className={`admission-link ${activeLink === 'admission' ? 'is-current' : ''}`} href="#admision" aria-current={activeLink === 'admission' ? 'page' : undefined}>{content.admissionLabel} <span className="admission-arrow" aria-hidden="true">→</span></a>
        <button className={`menu-button ${isMenuOpen ? 'is-open' : ''}`} type="button" aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => { if (open) setExpandedMenu(null); return !open })}><span></span><span></span><span></span></button>
      </div>
    </div>
    <nav className={`mobile-menu ${isMenuOpen ? 'is-open' : ''}`} aria-label="Navegación móvil">
      <NavigationItems navigation={navigation} mobile activeLink={activeLink} expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} onNavigate={navigate} />
      <div className="mobile-menu-actions"><a href="#contacto" onClick={() => navigate('contact')}>{content.contactLabel}</a><a href="#admision" onClick={() => navigate('admission')}>{content.admissionLabel} <span aria-hidden="true">→</span></a></div>
    </nav>
  </header>
}

export default function App() {
  const getView = () => {
    const { hash } = window.location
    if (hash === '#nosotros') return 'about'
    if (hash === '#sedes' || hash.startsWith('#sede-')) return 'campuses'
    if (hash === '#noticias') return 'news'
    if (hash === '#admision') return 'admission'
    if (hash === '#admin' || hash.startsWith('#admin/')) return 'admin'
    return 'home'
  }
  const [view, setView] = useState(getView)
  const adminDirtyRef = useRef(false)

  useEffect(() => {
    const updateView = () => {
      const nextView = getView()
      setView((currentView) => {
        if (currentView === 'admin' && nextView !== 'admin' && adminDirtyRef.current && !window.confirm('¿Salir del panel y descartar los cambios que todavía no guardaste?')) {
          window.setTimeout(() => { window.location.hash = '#admin' }, 0)
          return currentView
        }
        return nextView
      })
    }
    window.addEventListener('hashchange', updateView)
    return () => window.removeEventListener('hashchange', updateView)
  }, [])

  useEffect(() => {
    const warnBeforeUnload = (event) => {
      if (!adminDirtyRef.current) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warnBeforeUnload)
    return () => window.removeEventListener('beforeunload', warnBeforeUnload)
  }, [])

  useEffect(() => {
    const anchor = window.location.hash.slice(1)
    requestAnimationFrame(() => {
      const target = document.getElementById(anchor)
      if (target) target.scrollIntoView()
      else window.scrollTo({ top: 0 })
    })
  }, [view])

  const pages = {
    about: <AboutPage />,
    campuses: <CampusesPage />,
    news: <main><News /></main>,
    admission: <main><Admission /></main>,
  }

  if (view === 'admin') return <Suspense fallback={<main className="admin-route-loading">Cargando panel…</main>}><AdminApp onDirtyChange={(dirty) => { adminDirtyRef.current = dirty }} /></Suspense>
  return <><Header />{pages[view] ?? <Home />}<Footer /></>
}
