import { useState } from 'react'
import { useContent } from './content/ContentContext'
import { defaultSections } from './content/defaultContent'
import { whatsappLink } from './whatsapp'
import './home.css'

// Texto con soporte para **negritas** y saltos de línea, editable desde el CMS.
function RichText({ text = '' }) {
  return String(text).split('\n').map((line, lineIndex, lines) => <span key={lineIndex}>
    {line.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part)}
    {lineIndex < lines.length - 1 && <br />}
  </span>)
}

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.7-.3Z" /></svg>
}

function Decor({ className }) {
  return <span className={`home-decor ${className}`} aria-hidden="true"><span className="home-decor-ring" /><span className="home-decor-dot" /></span>
}

function HomeHero() {
  const { sections } = useContent()
  const hero = sections.homeHero
  return <section className="home-hero" aria-labelledby="home-hero-title">
    <div className="home-hero-inner">
      <div className="home-hero-copy">
        <p className="home-badge">{hero.badge}</p>
        <h1 id="home-hero-title">{hero.title}</h1>
        <a className="home-pill home-pill-navy" href={whatsappLink(sections.global)} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon />{hero.buttonLabel}<span className="sr-only"> (abre WhatsApp en una nueva pestaña)</span>
        </a>
      </div>
      <div className="home-hero-art">
        <span className="home-hero-circle home-hero-circle-navy" aria-hidden="true" />
        <span className="home-hero-circle home-hero-circle-orange" aria-hidden="true" />
        <img src={hero.image} alt={hero.imageAlt} fetchPriority="high" decoding="async" />
      </div>
    </div>
  </section>
}

function Welcome() {
  const { sections } = useContent()
  const content = sections.welcome
  const [first, ...rest] = content.paragraphs || []
  return <section className="home-welcome" id="bienvenidos" aria-labelledby="welcome-title">
    <div className="home-container">
      <p className="home-kicker">{content.kicker}</p>
      <h2 className="home-title" id="welcome-title">{content.title}<span className="home-accent home-title-break">{content.highlight}</span></h2>
      <div className="home-welcome-grid">
        <div className="home-welcome-lead">
          {first && <p><RichText text={first.text} /></p>}
          <figure className="home-director">
            <img src={content.image} alt={content.imageAlt} loading="lazy" decoding="async" />
            <figcaption><strong>{content.directorName}</strong><span>{content.directorRole}</span></figcaption>
          </figure>
        </div>
        <div className="home-welcome-columns">
          {rest.map((paragraph) => <p key={paragraph.id}><RichText text={paragraph.text} /></p>)}
        </div>
      </div>
    </div>
  </section>
}

function WhyHome() {
  const { sections } = useContent()
  const content = sections.whyHome
  return <section className="home-why" id="por-que-elegirnos" aria-labelledby="why-home-title">
    <div className="home-container">
      <h2 className="home-title home-title-light home-center" id="why-home-title">{content.title} <span className="home-accent">{content.highlight}</span> {content.titleEnd}</h2>
      <div className="home-why-grid">
        {content.reasons.map((reason) => <article className="home-why-card" key={reason.id || reason.title}>
          <h3>{reason.title}</h3>
          <p><RichText text={reason.text} /></p>
        </article>)}
      </div>
    </div>
  </section>
}

function Proposal() {
  const { sections } = useContent()
  const content = sections.proposal
  const [open, setOpen] = useState(null)
  return <section className="home-proposal home-checker" id="propuesta" aria-labelledby="proposal-title">
    <div className="home-container">
      <h2 className="home-title home-title-light home-center" id="proposal-title">{content.title} <span className="home-accent">{content.highlight}</span></h2>
      <div className="home-proposal-grid">
        {content.items.map((item) => {
          const isOpen = open === item.id
          const panelId = `proposal-${item.id}`
          return <article className={`home-proposal-card ${isOpen ? 'is-open' : ''}`} key={item.id}>
            <img src={item.image} alt={item.imageAlt} loading="lazy" decoding="async" />
            <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(isOpen ? null : item.id)}>
              {item.name}<span className="home-chevron" aria-hidden="true" />
            </button>
            <div className="home-proposal-panel" id={panelId}><div><p>{item.text}</p></div></div>
          </article>
        })}
      </div>
    </div>
  </section>
}

function AdmissionSteps() {
  const { sections } = useContent()
  const content = sections.steps
  return <section className="home-steps" id="proceso-admision" aria-labelledby="steps-title">
    <Decor className="home-decor-right" />
    <div className="home-container home-container-narrow">
      <p className="home-kicker">{content.kicker}</p>
      <h2 className="home-title" id="steps-title">{content.title} <span className="home-accent">{content.highlight}</span></h2>
      <ol className="home-steps-list">
        {content.items.map((step, index) => <li key={step.id || index}>
          <span className="home-step-number">{String(index + 1).padStart(2, '0')}</span>
          <div className="home-step-label"><small>Paso {index + 1}</small><strong>{step.title}</strong></div>
          <p>{step.text}</p>
        </li>)}
      </ol>
    </div>
  </section>
}

const levelTones = { nido: 'sky', inicial: 'yellow', primaria: 'periwinkle', secundaria: 'navy' }
const toneOrder = ['sky', 'yellow', 'periwinkle', 'navy']

function LevelsShowcase() {
  const { sections } = useContent()
  const content = sections.levels
  const fallbackItems = defaultSections.levels.items
  return <section className="home-levels" id="niveles" aria-label={content.cardKicker}>
    <Decor className="home-decor-left" />
    <Decor className="home-decor-right home-decor-low" />
    <div className="home-container home-container-narrow home-levels-list">
      {content.items.map((level, index) => {
        const tagline = level.tagline ?? fallbackItems.find((item) => item.id === level.id)?.tagline
        const tone = levelTones[level.id] || toneOrder[index % toneOrder.length]
        return <article className={`home-level home-level-${tone}`} id={`nivel-${level.id || index}`} key={level.id || level.name}>
          <div className="home-level-media"><img src={level.image} alt={level.imageAlt} loading="lazy" decoding="async" /></div>
          <div className="home-level-body">
            <p className="home-level-kicker">{content.cardKicker}</p>
            <div>
              {tagline && <p className="home-level-tagline">{tagline}</p>}
              <h3>{level.name}</h3>
              <p className="home-level-text">{level.text}</p>
            </div>
            <a className="home-pill home-level-button" href={whatsappLink(sections.global, `Hola, quisiera más información sobre el nivel ${level.name} en Paideia College.`)} target="_blank" rel="noopener noreferrer">
              {content.buttonLabel}<span className="sr-only"> sobre {level.name} (abre WhatsApp)</span>
            </a>
          </div>
        </article>
      })}
    </div>
  </section>
}

export default function Home() {
  return <main id="inicio" className="home-page">
    <HomeHero />
    <Welcome />
    <WhyHome />
    <Proposal />
    <AdmissionSteps />
    <LevelsShowcase />
  </main>
}
