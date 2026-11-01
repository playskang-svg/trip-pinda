import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  RichText as PayloadRichText,
} from '@payloadcms/richtext-lexical/react'
import type React from 'react'

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
