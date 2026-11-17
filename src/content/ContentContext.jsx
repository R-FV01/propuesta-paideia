import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { defaultNews, defaultSections } from './defaultContent'
import { loadPublishedContent } from '../cms/contentService'

const ContentContext = createContext({ sections: defaultSections, news: defaultNews, loading: false, source: 'defaults' })

export function ContentProvider({ children }) {
  const [state, setState] = useState({ sections: defaultSections, news: defaultNews, loading: true, source: 'defaults' })
  useEffect(() => { let active = true; loadPublishedContent().then((content) => { if (active) setState({ ...content, loading: false }) }); return () => { active = false } }, [])
  useEffect(() => {
    const theme = state.sections.brandTheme
    if (!theme) return
    const root = document.documentElement
    const tokens = {
      '--pd-blue': theme.blueColor, '--pd-orange': theme.orangeColor, '--pd-navy': theme.navyColor, '--pd-deep-navy': theme.deepNavyColor,
      '--pd-cream': theme.creamColor, '--pd-sky': theme.skyColor, '--pd-yellow': theme.yellowColor, '--pd-periwinkle': theme.periwinkleColor, '--pd-teal': theme.tealColor,
      // Variables heredadas que usan las demás páginas.
      '--color-primary': theme.orangeColor, '--color-orange': theme.orangeColor, '--color-navy': theme.navyColor, '--color-dark': theme.deepNavyColor, '--color-background': theme.creamColor,
    }
    Object.entries(tokens).forEach(([name, value]) => { if (/^#[0-9a-fA-F]{6}$/.test(value || '')) root.style.setProperty(name, value) })
  }, [state.sections.brandTheme])
  const value = useMemo(() => state, [state])
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export const useContent = () => useContext(ContentContext)
