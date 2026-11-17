import { useCallback, useEffect, useState } from 'react'

export default function useFlash() {
  const [flash, setFlash] = useState(null)
  useEffect(() => {
    if (!flash) return undefined
    const timeout = window.setTimeout(() => setFlash(null), 5000)
    return () => window.clearTimeout(timeout)
  }, [flash])
  const showFlash = useCallback((message, type = 'success') => {
    setFlash({ id: Date.now(), message, type })
  }, [])
  return { flash, showFlash }
}

export function FlashMessage({ flash }) {
  if (!flash) return null
  return <div className={`admin-flash is-${flash.type}`} role="status"><span aria-hidden="true">{flash.type === 'error' ? '!' : '✓'}</span>{flash.message}</div>
}
