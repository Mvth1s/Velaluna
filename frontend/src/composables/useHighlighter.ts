import { createHighlighter, type Highlighter } from 'shiki'

let instance: Promise<Highlighter> | null = null

function getHighlighter(): Promise<Highlighter> {
  if (!instance) {
    instance = createHighlighter({
      themes: ['github-dark'],
      langs: ['javascript', 'typescript', 'bash', 'python', 'html', 'css']
    })
  }
  return instance
}

export type { Highlighter }
export { getHighlighter }
