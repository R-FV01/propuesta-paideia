import aboutImage from './assets/nosotros-hero.jpg'
import CommunityCarousel from './CommunityCarousel'
import './about-page.css'

const values = [
  { number: '01', title: 'Cercanía', text: 'Acompañamos a cada estudiante y a su familia con escucha, respeto y atención genuina.' },
  { number: '02', title: 'Excelencia', text: 'Convertimos la curiosidad en aprendizaje y los retos en oportunidades para crecer.' },
  { number: '03', title: 'Integridad', text: 'Formamos personas coherentes, responsables y comprometidas con su comunidad.' },
]

export default function AboutPage() {
  return <main className="about-page" id="nosotros">
    <section className="about-hero" aria-labelledby="about-title">
      <span className="about-hero-orbit" aria-hidden="true" />
      <span className="about-hero-sun" aria-hidden="true" />
      <div className="about-hero-inner">
        <div className="about-hero-copy about-reveal">
          <p className="about-kicker">Conoce Paideia</p>
          <h1 id="about-title">Una escuela que<br /><span>cree en cada futuro.</span></h1>
          <p>Somos una comunidad educativa que acompaña a niñas, niños y adolescentes para que aprendan con confianza, vivan sus valores y descubran su mejor versión.</p>
          <a className="about-cta" href="#niveles">Conoce nuestra propuesta <span aria-hidden="true">→</span></a>
        </div>
        <div className="about-hero-image about-reveal about-delay-one">
          <img src={aboutImage} alt="Docente Paideia acompañando el aprendizaje de una estudiante" />
          <span className="about-image-tag"><strong>Desde 2007</strong>Educando con propósito</span>
        </div>
      </div>
    </section>

    <section className="about-story" aria-labelledby="story-title">
      <div className="about-story-grid">
        <p className="about-kicker about-reveal">Nuestra esencia</p>
        <h2 className="about-reveal about-delay-one" id="story-title">Aprender no es repetir.<br /><span>Es descubrir quién puedes llegar a ser.</span></h2>
        <div className="about-story-copy about-reveal about-delay-two"><p>En Paideia entendemos que cada estudiante aprende de manera distinta. Por eso creamos experiencias cercanas, activas y retadoras, donde el conocimiento convive con la creatividad, el cuidado y los valores.</p><p>Queremos que vengan contentos a aprender y que salgan preparados para transformar su entorno.</p></div>
      </div>
      <div className="about-stat-row about-reveal about-delay-three">
        <div><strong>3</strong><span>Sedes para estar cerca de tu familia</span></div>
        <div><strong>4</strong><span>Etapas educativas para crecer paso a paso</span></div>
        <div><strong>1</strong><span>Comunidad que impulsa cada talento</span></div>
      </div>
      <CommunityCarousel />
    </section>

    <section className="about-purpose" aria-labelledby="purpose-title">
      <span className="about-purpose-dots" aria-hidden="true" />
      <div className="about-purpose-heading"><p className="about-kicker">Nuestro propósito</p><h2 id="purpose-title">Una educación que<br /><span>trasciende el aula.</span></h2></div>
      <div className="about-purpose-cards">
        <article><span>01</span><h3>Misión</h3><p>Brindar una formación integral que ayude a cada estudiante a desarrollar sus talentos, pensar con autonomía y actuar con valores.</p></article>
        <article><span>02</span><h3>Visión</h3><p>Ser una comunidad educativa cercana e innovadora, reconocida por formar personas seguras, solidarias y preparadas para su futuro.</p></article>
      </div>
    </section>

    <section className="about-values" aria-labelledby="values-title">
      <div className="about-values-intro"><p className="about-kicker">Lo que nos guía</p><h2 id="values-title">Valores que se<br />aprenden viviendo.</h2></div>
      <div className="about-values-list">{values.map((value) => <article key={value.title}><span>{value.number}</span><h3>{value.title}</h3><p>{value.text}</p><i aria-hidden="true">↗</i></article>)}</div>
    </section>
  </main>
}
