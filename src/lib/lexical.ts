/** Builds Lexical rich text JSON from plain strings (used by templates, demo content and imports). */
const textNode = (text: string, format = 0) => ({ type: 'text', version: 1, text, format, detail: 0, mode: 'normal', style: '' })
const base = { version: 1, direction: 'ltr' as const, format: '' as const, indent: 0 }

export const p = (text: string) => ({ ...base, type: 'paragraph', textFormat: 0, children: [textNode(text)] })
export const h = (tag: 'h2' | 'h3' | 'h4', text: string) => ({ ...base, type: 'heading', tag, children: [textNode(text)] })
export const ul = (items: string[]) => ({
  ...base,
  type: 'list',
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  children: items.map((t, i) => ({ ...base, type: 'listitem', value: i + 1, children: [textNode(t)] })),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rt = (...children: any[]): any => ({ root: { ...base, type: 'root', children } })
export const rtText = (text: string) => rt(...text.split(/\n{2,}/).map((x) => p(x.trim())).filter((x) => x.children[0]!.text))
