'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const MarketingModeContext = createContext<boolean>(false)

export function MarketingModeProvider({ children }: { children: ReactNode }) {
  const [marketingMode, setMarketingMode] = useState<boolean>(false)

  useEffect(() => {
    function handle(e: Event) {
      const mode = (e as CustomEvent<{ mode: 'full' | 'marketing' }>).detail.mode
      setMarketingMode(mode === 'marketing')
    }
    document.addEventListener('proto:marketing', handle)
    return () => document.removeEventListener('proto:marketing', handle)
  }, [])

  return <MarketingModeContext.Provider value={marketingMode}>{children}</MarketingModeContext.Provider>
}

export const useMarketingMode = () => useContext(MarketingModeContext)
