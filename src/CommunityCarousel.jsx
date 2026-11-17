import { useEffect, useState } from 'react'
import { useContent } from './content/ContentContext'

export default function CommunityCarousel() {
  const { sections } = useContent()
  const content = sections.about
  const slides = content.gallery.map((item, index) => ({ ...item, number: index + 1 }))
  const [activeSlide, setActiveSlide] = useState(0)
  const total = slides.length

  useEffect(() => {
    if (total < 2) return undefined
    const interval = window.setInterval(() => setActiveSlide((current) => (current + 1) % total), 5500)
    return () => window.clearInterval(interval)
  }, [total])

  if (!total) return null

  const goTo = (index) => setActiveSlide((index + total) % total)

  return <figure className="community-carousel about-reveal about-delay-three" aria-label="Momentos de la comunidad Paideia">
    <div className="community-carousel-stage">
      {slides.map((slide, index) => <div className={`community-carousel-slide ${activeSlide === index ? 'is-active' : ''}`} key={slide.image}>
        <img className="community-carousel-backdrop" src={slide.image} alt="" aria-hidden="true" />
        <img className="community-carousel-photo" src={slide.image} alt={slide.imageAlt} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
      </div>)}
      <div className="community-carousel-caption"><span>{content.galleryKicker}</span><strong>{content.galleryTitle}</strong></div>
      {total > 1 && <div className="community-carousel-arrows"><button type="button" onClick={() => goTo(activeSlide - 1)} aria-label="Imagen anterior">←</button><button type="button" onClick={() => goTo(activeSlide + 1)} aria-label="Siguiente imagen">→</button></div>}
    </div>
    <figcaption className="community-carousel-footer"><span>0{activeSlide + 1} <i>/</i> 0{total}</span>{total > 1 && <div className="community-carousel-dots">{slides.map((slide, index) => <button className={activeSlide === index ? 'is-active' : ''} type="button" aria-label={`Ver imagen ${slide.number}`} aria-current={activeSlide === index} onClick={() => goTo(index)} key={slide.image} />)}</div>}</figcaption>
  </figure>
}
