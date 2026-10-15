/**
 * Slidea: 資料（deck）の読み込みと自動保存。
 * Slidea 本体（apps/web）の /api/decks/:id/pptist とやり取りする。
 */
import { ref } from 'vue'
import { useSlidesStore } from '@/store'
import type { Slide, SlideTheme } from '@/types/slides'
import message from '@/utils/message'

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error' | 'conflict'

interface DeckDocument {
  revision: number
  title: string
  theme?: Partial<SlideTheme>
  slides: Slide[]
  viewportSize: number
  viewportRatio: number
}

const SAVE_DELAY = 1500

export const deckId = new URLSearchParams(window.location.search).get('deck')
export const saveStatus = ref<SaveStatus>('idle')
export const DECKS_URL = '/decks'

let revision = 0
let lastSaved = ''
let timer: ReturnType<typeof setTimeout> | undefined
let saving: Promise<void> | null = null

const endpoint = (id: string) => `/api/decks/${encodeURIComponent(id)}/pptist`

const goLogin = () => {
  const callbackUrl = window.location.pathname + window.location.search
  window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
}

const snapshot = () => {
  const store = useSlidesStore()
  return JSON.stringify({
    title: store.title,
    theme: store.theme,
    slides: store.slides,
    viewportSize: store.viewportSize,
    viewportRatio: store.viewportRatio,
  })
}

/** 資料を読み込んでストアに反映する。失敗した場合は false */
export async function loadDeck(id: string): Promise<boolean> {
  const res = await fetch(endpoint(id), { credentials: 'same-origin' })
  if (res.status === 401) {
    goLogin()
    return false
  }
  if (!res.ok) {
    message.error(res.status === 404 ? '資料が見つかりません' : '資料の読み込みに失敗しました', { duration: 0, closable: true })
    return false
  }
  const doc = (await res.json()) as DeckDocument
  const store = useSlidesStore()
  store.setTitle(doc.title)
  store.setViewportSize(doc.viewportSize)
  store.setViewportRatio(doc.viewportRatio)
  store.setSlides(doc.slides, doc.theme)
  revision = doc.revision
  lastSaved = snapshot()
  saveStatus.value = 'saved'
  return true
}

async function save() {
  if (saveStatus.value === 'conflict') return
  const body = snapshot()
  if (body === lastSaved) {
    saveStatus.value = 'saved'
    return
  }
  saveStatus.value = 'saving'
  try {
    const res = await fetch(endpoint(deckId!), {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...JSON.parse(body), revision }),
    })
    if (res.status === 409) {
      saveStatus.value = 'conflict'
      message.error('この資料は別の場所で更新されました。ページを再読み込みしてください（この画面の変更は保存されていません）', { duration: 0, closable: true })
      return
    }
    if (res.status === 401) {
      saveStatus.value = 'error'
      message.error('ログインの有効期限が切れました。別のタブで再ログインしてから保存してください', { duration: 0, closable: true })
      return
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    revision = ((await res.json()) as { revision: number }).revision
    lastSaved = body
    saveStatus.value = snapshot() === lastSaved ? 'saved' : 'dirty'
    if (saveStatus.value === 'dirty') schedule()
  }
  catch {
    saveStatus.value = 'error'
    schedule(SAVE_DELAY * 4)
  }
}

/** 保存中なら完了を待ってから、未保存の変更を保存する */
export async function flush() {
  if (!deckId) return
  clearTimeout(timer)
  if (saving) await saving
  saving = save().finally(() => { saving = null })
  await saving
}

function schedule(delay = SAVE_DELAY) {
  clearTimeout(timer)
  timer = setTimeout(flush, delay)
}

/** ストアの変更を監視して自動保存する */
export function startAutoSave() {
  if (!deckId) return
  const store = useSlidesStore()
  store.$subscribe(() => {
    if (saveStatus.value === 'conflict') return
    if (saveStatus.value !== 'saving') saveStatus.value = 'dirty'
    schedule()
  })

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault()
      flush()
    }
  })

  window.addEventListener('beforeunload', e => {
    if (snapshot() !== lastSaved) {
      flush()
      e.preventDefault()
    }
  })
}
