import { useContent } from './content/ContentContext'
import './why-choose-us.css'

function ReasonIcon({ type }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'heart' && <path d="M16 27S4 19 4 11a6 6 0 0 1 12-1 6 6 0 0 1 12 1c0 8-12 16-12 16Z" />}
    {type === 'star' && <path d="m16 3 4 8 9 1-6.5 6.5L24 28l-8-4.5L8 28l1.5-9.5L3 12l9-1 4-8Z" />}
    {type === 'book' && <><path d="M16 9c-4-4-9-4-13-3v20c5-1 9 0 13 3 4-3 8-4 13-3V6c-4-1-9-1-13 3Zm0 0v20" /><path d="M7 12h4m-4 5h4m10-5h4m-4 5h4" /></>}
  </svg>
}

export default function WhyChooseUs() {
  const { sections } = useContent()
  const content = sections.why
  return <section className="why-section" id="por-que-elegirnos" aria-labelledby="why-title">
    <div className="why-decor" aria-hidden="true">
      <span className="why-corner why-corner-top" />
      <span className="why-corner why-corner-bottom" />
    </div>
    <div className="why-layout">
      <div className="why-image-frame">
        <span className="why-turning-triangle" aria-hidden="true" />
        <img src={content.image} alt={content.imageAlt} loading="lazy" decoding="async" />
      </div>
      <div className="why-copy">
        <span className="why-spinning-dots" aria-hidden="true" />
        <p className="section-kicker why-kicker">{content.kicker}</p>
        <h2 id="why-title">{content.title}</h2>
        <p className="why-intro">{content.intro}</p>
        <div className="why-reasons">
          {content.reasons.map(reason => <article className="why-reason" key={reason.id || reason.title}>
            <span className="why-icon"><ReasonIcon type={reason.icon} /></span>
            <div><h3>{reason.title}</h3><p>{reason.text}</p></div>
          </article>)}
        </div>
      </div>
    </div>
  </section>
}
