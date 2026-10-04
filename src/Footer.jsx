import './footer.css'

function SocialIcon({ name }) {
  if (name === 'facebook') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1Z" /></svg>
  if (name === 'instagram') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.7" r=".9" className="social-fill" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 3c.4 2.3 1.9 3.8 4.2 4v3.2a7.3 7.3 0 0 1-4.1-1.3v6.3a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v3.3a2.7 2.7 0 1 0 1.9 2.6V3Z" /></svg>
}

const socials = [
  { name: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/ieppaideia/' },
  { name: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/ieppaideia/' },
  { name: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@iep.paideia' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return <footer className="site-footer" id="contacto">
    <div className="footer-glow" aria-hidden="true" />
    <div className="footer-main">
      <div className="footer-intro">
        <a className="footer-brand" href="#inicio" aria-label="Paideia College, volver al inicio"><span>Paideia</span><small>College</small></a>
        <p>Educamos con cercanía, propósito y la convicción de que cada estudiante puede liderar su propio futuro.</p>
        <div className="footer-socials" aria-label="Redes sociales">
          {socials.map((social) => <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`${social.label} de Paideia (se abre en una nueva pestaña)`} key={social.name}><SocialIcon name={social.name} /></a>)}
        </div>
      </div>
      <div className="footer-column">
        <h2>Explora</h2>
        <a href="#inicio">Inicio</a>
        <a href="#niveles">Niveles educativos</a>
        <a href="#sedes">Nuestras sedes</a>
        <a href="#por-que-elegirnos">¿Por qué Paideia?</a>
        <a href="#noticias">Noticias</a>
        <a href="#preguntas-frecuentes">Preguntas frecuentes</a>
      </div>
      <div className="footer-column footer-locations">
        <h2>Sedes</h2>
        <p><strong>Trujillo</strong>Av. América Sur 3845</p>
        <p><strong>La Esperanza</strong>Jr. Manuel Cedeño 980</p>
        <p><strong>La Esperanza</strong>22 de Febrero 623</p>
      </div>
      <div className="footer-column footer-contact">
        <h2>Contáctanos</h2>
        <a href="tel:+51942666600">+51 942 666 600</a>
        <a href="mailto:informes@paideia.edu.pe">informes@paideia.edu.pe</a>
        <p>Lunes a viernes<br />8:00 a. m. — 2:00 p. m.</p>
        <a className="footer-admission" href="#admision">Admisión 2027 <span aria-hidden="true">→</span></a>
      </div>
    </div>
    <div className="footer-bottom"><p>© {year} Paideia College. Todos los derechos reservados.</p><div><a href="#privacidad">Privacidad</a><a href="#terminos">Términos y condiciones</a></div></div>
  </footer>
}
