import { createContext, useContext, useState, useEffect } from 'react'
import { t, languageCodes } from '../i18n/translations'

const LocaleContext = createContext()

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    // Load from localStorage or default
    const saved = localStorage.getItem('hk_locale')
    return saved || 'zh-HK'
  })

  // Save to localStorage when locale changes
  useEffect(() => {
    localStorage.setItem('hk_locale', locale)
    // Also set HTML lang attribute
    document.documentElement.lang = locale
  }, [locale])

  // Change language by display name
  const changeLanguage = (langName) => {
    const code = languageCodes[langName]
    if (code) {
      setLocale(code)
    }
  }

  // Get display name from code
  const getLanguageName = (code) => {
    const entries = Object.entries(languageCodes)
    for (const [name, c] of entries) {
      if (c === code) return name
    }
    return '繁體中文'
  }

  // Translation function bound to current locale
  const translate = (key) => t(key, locale)

  return (
    <LocaleContext.Provider value={{ 
      locale, 
      setLocale, 
      changeLanguage,
      getLanguageName,
      t: translate 
    }}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => useContext(LocaleContext)
