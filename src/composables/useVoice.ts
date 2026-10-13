import { onBeforeUnmount, ref } from 'vue'

// The Web Speech API isn't in TypeScript's DOM lib yet; this is the slice we use.
interface SpeechRecognitionResultLike {
  isFinal: boolean
  0: { transcript: string }
}
interface SpeechRecognitionEventLike {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResultLike>
}
interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((e: SpeechRecognitionEventLike) => void) | null
  onend: (() => void) | null
  onerror: ((e: { error: string }) => void) | null
  start(): void
  stop(): void
}
type RecognitionCtor = new () => SpeechRecognitionLike

const Recognition: RecognitionCtor | undefined =
  typeof window !== 'undefined'
    ? ((window as unknown as Record<string, RecognitionCtor | undefined>).SpeechRecognition ??
      (window as unknown as Record<string, RecognitionCtor | undefined>).webkitSpeechRecognition)
    : undefined

export const canListen = !!Recognition
export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

export function speak(text: string) {
  if (!canSpeak) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = 0.95
  window.speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (canSpeak) window.speechSynthesis.cancel()
}

/**
 * Continuous listening that survives the browser's habit of ending a session after a pause.
 * `onPhrase` receives every finalised phrase, lower-cased.
 */
export function useListener(onPhrase: (phrase: string) => void) {
  const listening = ref(false)
  const heard = ref('')
  const error = ref('')
  let rec: SpeechRecognitionLike | null = null
  let wanted = false

  function start() {
    if (!Recognition) {
      error.value = 'Voice control isn’t supported in this browser. Try Chrome, Edge or Safari.'
      return
    }
    wanted = true
    error.value = ''
    rec = new Recognition()
    rec.lang = 'en-US'
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]!
        heard.value = r[0].transcript
        if (r.isFinal) onPhrase(r[0].transcript.trim().toLowerCase())
      }
    }
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        error.value =
          'Microphone access was blocked. Allow it in your browser settings to cook hands-free.'
        wanted = false
      }
    }
    rec.onend = () => {
      if (wanted) rec?.start()
      else listening.value = false
    }
    rec.start()
    listening.value = true
  }

  function stop() {
    wanted = false
    rec?.stop()
    listening.value = false
  }

  onBeforeUnmount(stop)

  return { listening, heard, error, start, stop, supported: canListen }
}
