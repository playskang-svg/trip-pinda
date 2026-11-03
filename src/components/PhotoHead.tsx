import React from 'react'

import { type HeroClip, HeroVideo } from '@/components/HeroVideo'
import { wide } from '@/lib/images'

// Page heading set over a full-width photo.
export function PhotoHead({
  title,
  lede,
  photo,
  clip,
  photoAlt = '',
  srcSet,
  eyebrow,
  tall = false,
  children,
}: {
  title: string
  lede?: React.ReactNode
  photo?: string | null
  clip?: HeroClip
  photoAlt?: string
  srcSet?: string
  eyebrow?: React.ReactNode
  tall?: boolean
  children?: React.ReactNode
}) {
  return (
    <section className={tall ? 'photo-head photo-head--tall' : 'photo-head'}>
      {clip ? (
        <HeroVideo alt={photoAlt} clip={clip} />
      ) : photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={photoAlt}
          className="photo-head__img"
          fetchPriority="high"
          height={800}
          sizes="100vw"
          src={photo}
          srcSet={srcSet ?? wide(photo)}
          width={1200}
        />
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
