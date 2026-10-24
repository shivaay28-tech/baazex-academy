const PAGE_W = 595.28
const PAGE_H = 841.89
const MARGIN_X = 56
const CONTENT_W = PAGE_W - MARGIN_X * 2
const FOOTER_Y = 40
const BODY_BOTTOM = 68

const NAVY = '0.024 0.082 0.169'
const INK = '0.09 0.12 0.18'
const MUTED = '0.33 0.39 0.47'
const RULE = '0.78 0.83 0.88'

const WIDTHS: Record<string, number> = {
  ' ': 278,
  '!': 278,
  '"': 355,
  '#': 556,
  $: 556,
  '%': 889,
  '&': 667,
  "'": 191,
  '(': 333,
  ')': 333,
  '*': 389,
  '+': 584,
  ',': 278,
  '-': 333,
  '.': 278,
  '/': 278,
  '0': 556,
  '1': 556,
  '2': 556,
  '3': 556,
  '4': 556,
  '5': 556,
  '6': 556,
  '7': 556,
  '8': 556,
  '9': 556,
  ':': 278,
  ';': 278,
  '<': 584,
  '=': 584,
  '>': 584,
  '?': 556,
  '@': 1015,
  A: 667,
  B: 667,
  C: 722,
  D: 722,
  E: 667,
  F: 611,
  G: 778,
  H: 722,
  I: 278,
  J: 500,
  K: 667,
  L: 556,
  M: 833,
  N: 722,
  O: 778,
  P: 667,
  Q: 778,
  R: 722,
  S: 667,
  T: 611,
  U: 722,
  V: 667,
  W: 944,
  X: 667,
  Y: 667,
  Z: 611,
  a: 556,
  b: 556,
  c: 500,
  d: 556,
  e: 556,
  f: 278,
  g: 556,
  h: 556,
  i: 222,
  j: 222,
  k: 500,
  l: 222,
  m: 833,
  n: 556,
  o: 556,
  p: 556,
  q: 556,
  r: 333,
  s: 500,
  t: 278,
  u: 556,
  v: 500,
  w: 722,
  x: 500,
  y: 500,
  z: 500,
}

type FontName = 'F1' | 'F2' | 'F3'

type Block =
  | { kind: 'text'; font: FontName; size: number; color: string; text: string; leading: number; gapAfter: number }
  | { kind: 'rule'; gapBefore: number; gapAfter: number }
  | { kind: 'gap'; height: number }

export type LessonPdfInput = {
  academy: string
  courseTitle: string
  lessonTitle: string
  summary: string
  paragraphs: string[]
}

function plain(value: string) {
  return value
    .replaceAll('\u2018', "'")
    .replaceAll('\u2019', "'")
    .replaceAll('\u201C', '"')
    .replaceAll('\u201D', '"')
    .replaceAll('\u2013', '-')
    .replaceAll('\u2014', ' - ')
    .replaceAll('\u2026', '...')
    .replaceAll('\u00A0', ' ')
    .replace(/[^\x20-\x7E\n]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function pdfEscape(value: string) {
  return value.replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)')
}

function textWidth(value: string, size: number, bold: boolean) {
  const scale = ((bold ? 1.05 : 1) * size) / 1000
  let width = 0
  for (const char of value) width += (WIDTHS[char] ?? 520) * scale
  return width
}

function wrap(value: string, size: number, bold: boolean, maxWidth: number) {
  const words = plain(value).split(' ').filter(Boolean)
  const lines: string[] = []
  let current = ''

  const pushLongWord = (word: string) => {
    let piece = ''
    for (const char of word) {
      const next = piece + char
      if (piece && textWidth(next, size, bold) > maxWidth) {
        lines.push(piece)
        piece = char
      } else {
        piece = next
      }
    }
    return piece
  }

  for (const word of words) {
    const trial = current ? `${current} ${word}` : word
    if (textWidth(trial, size, bold) <= maxWidth) {
      current = trial
      continue
    }
    if (current) lines.push(current)
    current = textWidth(word, size, bold) <= maxWidth ? word : pushLongWord(word)
  }
  if (current) lines.push(current)
  return lines.length > 0 ? lines : ['']
}

function textCommand(font: FontName, size: number, x: number, y: number, color: string, value: string) {
  return `BT\n${color} rg\n/${font} ${size} Tf\n1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm\n(${pdfEscape(value)}) Tj\nET\n`
}

function pagesFor(blocks: Block[]) {
  const pages: string[][] = []
  let lines: string[] = []
  let y = PAGE_H - 70

  const nextPage = () => {
    pages.push(lines)
    lines = []
    y = PAGE_H - 86
  }

  for (const block of blocks) {
    if (block.kind === 'gap') {
      if (y - block.height < BODY_BOTTOM) nextPage()
      else y -= block.height
      continue
    }
    if (block.kind === 'rule') {
      const needed = block.gapBefore + block.gapAfter + 1
      if (y - needed < BODY_BOTTOM) {
        nextPage()
      }
      y -= block.gapBefore
      lines.push(`${RULE} RG\n0.6 w\n${MARGIN_X} ${y.toFixed(2)} m ${(PAGE_W - MARGIN_X).toFixed(2)} ${y.toFixed(2)} l\nS\n`)
      y -= block.gapAfter
      continue
    }

    const bold = block.font === 'F2'
    const wrapped = wrap(block.text, block.size, bold, CONTENT_W)
    for (const line of wrapped) {
      if (y - block.leading < BODY_BOTTOM) nextPage()
      lines.push(textCommand(block.font, block.size, MARGIN_X, y, block.color, line))
      y -= block.leading
    }
    y -= block.gapAfter
  }

  if (lines.length > 0 || pages.length === 0) pages.push(lines)
  return pages
}

function decorate(body: string[], pageNumber: number, pageCount: number, runningTitle: string, academyLabel: string) {
  const header = [
    `${NAVY} rg\n0 ${PAGE_H - 36} ${PAGE_W} 36 re\nf\n`,
    textCommand('F2', 9, MARGIN_X, PAGE_H - 23, '1 1 1', academyLabel),
    textCommand('F1', 9, PAGE_W - MARGIN_X - textWidth('Lesson notes', 9, false), PAGE_H - 23, '0.78 0.88 1', 'Lesson notes'),
    pageNumber > 1 ? textCommand('F1', 8, MARGIN_X, PAGE_H - 58, MUTED, runningTitle) : '',
    body.join(''),
    `${RULE} RG\n0.6 w\n${MARGIN_X} 52 m ${(PAGE_W - MARGIN_X).toFixed(2)} 52 l\nS\n`,
    textCommand('F1', 8, MARGIN_X, FOOTER_Y, MUTED, 'Educational use only. This lesson does not suggest placing an order.'),
    textCommand('F1', 8, PAGE_W - MARGIN_X - textWidth(`${pageNumber} / ${pageCount}`, 8, false), FOOTER_Y, MUTED, `${pageNumber} / ${pageCount}`),
  ]
  return header.join('')
}

function documentBlocks(input: LessonPdfInput): Block[] {
  const paragraphs = input.paragraphs.map(plain).filter(Boolean)
  return [
    { kind: 'text', font: 'F2', size: 20, color: NAVY, text: input.lessonTitle, leading: 24, gapAfter: 8 },
    { kind: 'text', font: 'F1', size: 11, color: MUTED, text: input.courseTitle, leading: 15, gapAfter: 4 },
    { kind: 'text', font: 'F3', size: 11, color: INK, text: input.summary, leading: 16, gapAfter: 4 },
    { kind: 'rule', gapBefore: 8, gapAfter: 16 },
    ...paragraphs.flatMap<Block>((paragraph) => [
      { kind: 'text', font: 'F1', size: 11, color: INK, text: paragraph, leading: 16, gapAfter: 10 },
    ]),
    { kind: 'gap', height: 6 },
    { kind: 'rule', gapBefore: 4, gapAfter: 12 },
    {
      kind: 'text',
      font: 'F3',
      size: 9,
      color: MUTED,
      text: 'For study only. These notes explain the lesson. They do not recommend a trade.',
      leading: 13,
      gapAfter: 0,
    },
  ]
}

function assemble(streams: string[]) {
  const pageNumbers = streams.map((_, index) => 6 + index * 2)
  const objects: string[] = []
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[2] = `<< /Type /Pages /Kids [${pageNumbers.map((number) => `${number} 0 R`).join(' ')}] /Count ${streams.length} >>`
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'
  objects[5] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>'

  streams.forEach((stream, index) => {
    const pageNumber = 6 + index * 2
    const contentNumber = pageNumber + 1
    objects[pageNumber] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${contentNumber} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> >>`
    objects[contentNumber] = stream
  })

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  const count = 5 + streams.length * 2
  for (let number = 1; number <= count; number += 1) {
    offsets[number] = pdf.length
    const body = objects[number] ?? ''
    const isPage = number >= 6 && number % 2 === 0
    if (isPage) {
      pdf += `${number} 0 obj\n${body}\nendobj\n`
    } else if (number >= 6) {
      pdf += `${number} 0 obj\n<< /Length ${body.length} >>\nstream\n${body}\nendstream\nendobj\n`
    } else {
      pdf += `${number} 0 obj\n${body}\nendobj\n`
    }
  }

  const startxref = pdf.length
  pdf += `xref\n0 ${count + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (let number = 1; number <= count; number += 1) {
    pdf += `${String(offsets[number]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${count + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`
  return pdf
}

export function lessonNotesPdf(input: LessonPdfInput) {
  const running = plain(`${input.courseTitle} | ${input.lessonTitle}`)
  const runningTitle = running.length > 88 ? `${running.slice(0, 85)}...` : running
  const academyLabel = plain(input.academy).toUpperCase() || 'ACADEMY'
  const laidOut = pagesFor(documentBlocks(input))
  const streams = laidOut.map((body, index) => decorate(body, index + 1, laidOut.length, runningTitle, academyLabel))
  return new Blob([assemble(streams)], { type: 'application/pdf' })
}
