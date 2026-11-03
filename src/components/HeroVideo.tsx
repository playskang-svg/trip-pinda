'use client'

import { useEffect, useRef, useState } from 'react'

export type HeroClip = { src: string; mobileSrc?: string; poster: string; mobilePoster?: string }

// Looping, silent background clip under a page heading. The poster is a normal image, so the heading paints
// before any video loads; the clip only starts for people who have not asked for less motion or less data.
export function HeroVideo({ clip, alt }: { clip: HeroClip; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (still || saveData) return
    const narrow = window.matchMedia('(max-width: 759px)').matches
    setSrc(narrow && clip.mobileSrc ? clip.mobileSrc : clip.src)
  }, [clip])

  useEffect(() => {
    const video = ref.current
    if (!video || !src) return
    video.load()
    const start = () => {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
    video.addEventListener('canplay', start, { once: true })
    return () => video.removeEventListener('canplay', start)
  }, [src])

  return (
    <>
      <picture>
        {clip.mobilePoster ? <source media="(max-width: 759px)" srcSet={clip.mobilePoster} /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={alt} className="photo-head__img" fetchPriority="high" height={720} src={clip.poster} width={1280} />
      </picture>
      {src ? (
        <video
          aria-hidden="true"
          className={playing ? 'photo-head__video is-playing' : 'photo-head__video'}
          disablePictureInPicture
          loop
          muted
          playsInline
          preload="auto"
          ref={ref}
          src={src}
          tabIndex={-1}
        />
      ) : null}
    </>
  )
}
