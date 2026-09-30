import type { ReactNode } from 'react'

export type Lang = 'py' | 'cs' | 'js'

const KEYWORDS: Record<Lang, Set<string>> = {
  py: new Set(['from', 'import', 'def', 'async', 'await', 'return', 'for', 'in', 'if', 'else', 'while', 'and', 'or', 'not', 'True', 'False', 'None', 'range', 'as']),
  cs: new Set(['void', 'float', 'int', 'bool', 'new', 'if', 'else', 'public', 'private', 'return', 'true', 'false', 'var', 'class']),
  js: new Set(['const', 'let', 'var', 'function', 'return', 'if', 'else', 'true', 'false', 'null', 'new', 'await', 'async']),
}

export const TOKEN_COLORS = {
  keyword: '#ff8a6b',
  string: '#5fe0b0',
  number: '#ffd24d',
  fn: '#9fb0ff',
  type: '#ffd98a',
  comment: '#6f7690',
  deco: '#ffd24d',
  plain: '#e9ecf5',
} as const

const RE =
  /(#[^\n]*|\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(@[A-Za-z_][\w.]*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_Ѐ-ӿ][\wЀ-ӿ]*)/g

/** Tiny tokenizer good enough for short teaching snippets. */
export function highlight(code: string, lang: Lang): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let k = 0
  const kw = KEYWORDS[lang]
  for (const m of code.matchAll(RE)) {
    const idx = m.index ?? 0
    if (idx > last) out.push(code.slice(last, idx))
    const [tok, comment, str, deco, num, word] = m
    let color: string = TOKEN_COLORS.plain
    let italic = false
    if (comment) {
      // '#' is a comment only in Python; in C#/JS it doesn't start comments
      if (comment.startsWith('#') && lang !== 'py') color = TOKEN_COLORS.plain
      else {
        color = TOKEN_COLORS.comment
        italic = true
      }
    } else if (str) color = TOKEN_COLORS.string
    else if (deco) color = TOKEN_COLORS.deco
    else if (num) color = TOKEN_COLORS.number
    else if (word) {
      const next = code.slice(idx + tok.length).match(/^\s*\(/)
      if (kw.has(word)) color = TOKEN_COLORS.keyword
      else if (next) color = TOKEN_COLORS.fn
      else if (/^[A-Z]/.test(word)) color = TOKEN_COLORS.type
    }
    out.push(
      <span key={k++} style={{ color, fontStyle: italic ? 'italic' : undefined }}>
        {tok}
      </span>,
    )
    last = idx + tok.length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}
