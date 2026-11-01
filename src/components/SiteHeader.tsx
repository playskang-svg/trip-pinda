'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Item = { id?: string | null; label: string; url: string }

export function SiteHeader({ items, siteName }: { items: Item[]; siteName: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header">
      <div className="frame site-header__inner">
        <Link className="wordmark" href="/">
          {siteName}
        </Link>
        <button
          aria-controls="site-menu"
          aria-expanded={open}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          className="menu-toggle"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span aria-hidden="true" className="menu-toggle__bars" />
        </button>
        <div className={open ? 'site-menu is-open' : 'site-menu'} id="site-menu">
          <nav aria-label="주요 메뉴" className="site-nav">
            {items.map((item) => (
              <Link
                aria-current={pathname === item.url ? 'page' : undefined}
                href={item.url}
                key={item.id ?? item.url}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action="/search" className="site-search" role="search">
            <label className="sr-only" htmlFor="site-q">
              글 검색
            </label>
            <input id="site-q" name="q" placeholder="글 검색" type="search" />
          </form>
        </div>
      </div>
    </header>
  )
}
