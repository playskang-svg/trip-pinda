'use client'

import { useState } from 'react'

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // In-app browsers often block the clipboard API.
      const area = document.createElement('textarea')
      area.value = code
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button className={copied ? 'copy-code is-done' : 'copy-code'} onClick={copy} type="button">
      <strong>{code}</strong>
      <em aria-live="polite">{copied ? '복사됨 ✓' : '누르면 복사'}</em>
    </button>
  )
}
