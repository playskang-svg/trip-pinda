import React from 'react'

// Page heading set over a full-width photo.
export function PhotoHead({
  title,
  lede,
  photo,
  photoAlt = '',
  eyebrow,
  tall = false,
  children,
}: {
  title: string
  lede?: React.ReactNode
  photo?: string | null
  photoAlt?: string
  eyebrow?: React.ReactNode
  tall?: boolean
  children?: React.ReactNode
}) {
  return (
    <section className={tall ? 'photo-head photo-head--tall' : 'photo-head'}>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={photoAlt} className="photo-head__img" fetchPriority="high" height={800} src={photo} width={1200} />
      ) : null}
      <div className="frame photo-head__body">
        {eyebrow}
        <h1>{title}</h1>
        {lede ? <p className="photo-head__lede">{lede}</p> : null}
        {children}
      </div>
    </section>
  )
}
