import './footer.css'
import { useContent } from './content/ContentContext'
import logoLight from './assets/logo-paideia-light.png'

function SocialIcon({ name }) {
  if (name === 'facebook') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-1.6 19.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 12 2Z" /></svg>
  if (name === 'instagram') return <svg viewBox="0 0 24 24" aria-hidden="true" className="is-stroke"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.7" r=".9" className="social-fill" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 3c.4 2.3 1.9 3.8 4.2 4v3.2a7.3 7.3 0 0 1-4.1-1.3v6.3a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v3.3a2.7 2.7 0 1 0 1.9 2.6V3Z" /></svg>
}

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.7-.3Z" /></svg>
}

export default function Footer() {
  const { sections } = useContent()
  const content = sections.footer
  const brand = sections.global
  const year = new Date().getFullYear()
  const isExternal = (href = '') => /^https?:/.test(href)
  return <footer className="site-footer" id="contacto">
    <div className="footer-main">
      <a className="footer-brand" href="#inicio" aria-label={`${brand.brandName} ${brand.brandSubtitle}, volver al inicio`}>
        <img src={logoLight} alt="" width="685" height="231" loading="lazy" />
      </a>
      <nav className="footer-column" aria-label={content.exploreTitle}>
        <h2>{content.exploreTitle}</h2>
        {content.exploreLinks.map((link) => <a href={link.href} key={link.id}>{link.label}</a>)}
      </nav>
      <div className="footer-column footer-contact">
        <h2>{content.contactTitle}</h2>
        <a className="footer-phone" href={content.phoneHref} {...(isExternal(content.phoneHref) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><WhatsAppIcon />{content.phoneLabel}</a>
        {content.locations.map((location) => <p key={location.id}><strong>{location.name}</strong>{location.address}</p>)}
      </div>
      <div className="footer-column footer-socials">
        <h2>{content.socialsTitle || 'Síguenos'}</h2>
        {content.socials.map((social) => <a href={social.href} target="_blank" rel="noopener noreferrer" key={social.id}>
          <SocialIcon name={social.name} />{social.label}<span className="sr-only"> (se abre en una nueva pestaña)</span>
        </a>)}
      </div>
    </div>
    <div className="footer-bottom"><p>© {year} {content.copyrightName}. Todos los derechos reservados.</p><div><a href={content.privacyHref}>{content.privacyLabel}</a><a href={content.termsHref}>{content.termsLabel}</a></div></div>
  </footer>
}
