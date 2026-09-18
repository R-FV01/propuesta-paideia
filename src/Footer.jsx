import './footer.css'

function SocialIcon({ name }) {
  if (name === 'facebook') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1Z" /></svg>
  if (name === 'instagram') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.7" r=".9" className="social-fill" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6.4a8.3 8.3 0 0 1-2.3.6 4 4 0 0 0 1.8-2.2 8.1 8.1 0 0 1-2.5 1 4 4 0 0 0-6.8 3.6A11.4 11.4 0 0 1 2 5.3a4 4 0 0 0 1.2 5.3 4 4 0 0 1-1.8-.5 4 4 0 0 0 3.2 4 4 4 0 0 1-1.8.1 4 4 0 0 0 3.7 2.8A8.2 8.2 0 0 1 2 18.5 11.5 11.5 0 0 0 8.2 20c7.4 0 11.5-6.2 11.5-11.5v-.5A8.2 8.2 0 0 0 22 5.9c-.7.3-1.3.4-2 .5Z" /></svg>
}

export default function Footer() {
  const year = new Date().getFullYear()
  return <footer className="site-footer" id="contacto">
    <div className="footer-glow" aria-hidden="true" />
    <div className="footer-main">
      <div className="footer-intro">
        <a className="footer-brand" href="#inicio" aria-label="Paideia College, volver al inicio"><span>Paideia</span><small>College</small></a>
        <p>Educamos con cercanía, propósito y la convicción de que cada estudiante puede liderar su propio futuro.</p>
        <div className="footer-socials" aria-label="Redes sociales">
          <a href="#facebook" aria-label="Facebook"><SocialIcon name="facebook" /></a>
          <a href="#instagram" aria-label="Instagram"><SocialIcon name="instagram" /></a>
          <a href="#x" aria-label="X"><SocialIcon name="x" /></a>
        </div>
      </div>
      <div className="footer-column">
        <h2>Explora</h2>
        <a href="#inicio">Inicio</a>
        <a href="#niveles">Niveles educativos</a>
        <a href="#sedes">Nuestras sedes</a>
        <a href="#por-que-elegirnos">¿Por qué Paideia?</a>
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
