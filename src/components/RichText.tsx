import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  RichText as PayloadRichText,
} from '@payloadcms/richtext-lexical/react'
import type React from 'react'

import { retina } from '@/lib/images'

type CtaFields = { hook: string; name: string; button: string; url: string; image?: string | null }
type PhotoFields = { src: string; alt: string; caption: string }
type FactsFields = { name: string; score: string; count: string; note: string; rows?: { label: string; value: string }[] }
type CompareFields = {
  caption: string
  columns?: { label: string }[]
  rows?: { label: string; cells?: { value: string }[] }[]
}

const startsWithCaptionMark = (node: { children?: unknown[] }): boolean => {
  const first = node.children?.[0] as { text?: string } | undefined
  return Boolean(first?.text?.startsWith('▲'))
}

// `midway` is rendered once, right before the third H2, so the hook lands after the reader has the facts.
const MIDWAY_HEADING = 3

export function RichText({ data, midway }: { data: unknown; midway?: React.ReactNode }) {
  let headings = 0
  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    blocks: {
      cta: ({ node }: { node: { fields: CtaFields } }) => {
        const { hook, name, button, url, image } = node.fields
        return (
          <a className="post-cta" href={url} rel="sponsored nofollow noopener" target="_blank">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={name} height={300} loading="lazy" src={image} srcSet={retina(image)} width={400} />
            ) : null}
            <span className="post-cta__body">
              <strong>{hook}</strong>
              <small>{name}</small>
              <span className="button button--go">{button}</span>
            </span>
          </a>
        )
      },
      photo: ({ node }: { node: { fields: PhotoFields } }) => {
        const { src, alt, caption } = node.fields
        return (
          <figure className="post-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={alt} height={667} loading="lazy" src={src} srcSet={retina(src)} width={1000} />
            <figcaption>▲ {caption}</figcaption>
          </figure>
        )
      },
      compare: ({ node }: { node: { fields: CompareFields } }) => {
        const { caption, columns, rows } = node.fields
        return (
          // Scrolls sideways inside its own box on narrow phones instead of widening the page.
          <div aria-label={caption} className="compare" role="region" tabIndex={0}>
            <table>
              <caption>{caption}</caption>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">항목</span>
                  </th>
                  {columns?.map((column) => (
                    <th key={column.label} scope="col">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows?.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.cells?.map((cell, index) => (
                      <td key={index}>{cell.value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      },
      facts: ({ node }: { node: { fields: FactsFields } }) => {
        const { name, score, count, note, rows } = node.fields
        return (
          <aside aria-label={`${name} 요약`} className="hotel-facts">
            <div className="hotel-facts__score">
              <strong>{score}</strong>
              <small>후기 {count}개</small>
            </div>
            <dl>
              {rows?.map((row) => (
                <div key={row.label} style={{ display: 'contents' }}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="hotel-facts__note">{note}</p>
          </aside>
        )
      },
    },
    paragraph: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      if (startsWithCaptionMark(node)) return <p className="caption">{children}</p>
      return <p>{children}</p>
    },
    link: ({ node, nodesToJSX }) => {
      const href = (node.fields as { url?: string }).url ?? ''
      const sponsored = href.includes('3ha.in')
      return (
        <a
          href={href}
          rel={sponsored ? 'sponsored nofollow noopener' : undefined}
          target={sponsored ? '_blank' : undefined}
        >
          {nodesToJSX({ nodes: node.children })}
        </a>
      )
    },
    heading: ({ node, nodesToJSX }) => {
      const Tag = node.tag as 'h2' | 'h3'
      const children = nodesToJSX({ nodes: node.children })
      if (Tag === 'h2') headings += 1
      return (
        <>
          {midway && Tag === 'h2' && headings === MIDWAY_HEADING ? midway : null}
          <Tag>{children}</Tag>
        </>
      )
    },
  })
  return (
    <div className="prose">
      <PayloadRichText
        converters={converters}
        data={data as SerializedEditorState}
        disableContainer
      />
    </div>
  )
}
