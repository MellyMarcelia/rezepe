import { ref } from 'vue'

export interface Toast {
  id: number
  text: string
  icon?: 'check' | 'heart' | 'bookmark' | 'link'
  action?: { label: string; run: () => void }
}

const toasts = ref<Toast[]>([])
let nextId = 1

/** App-wide, so any screen can confirm an action without owning a toast component. */
export function useToast() {
  function show(text: string, opts: Omit<Toast, 'id' | 'text'> = {}) {
    const id = nextId++
    toasts.value = [...toasts.value.slice(-2), { id, text, ...opts }]
    window.setTimeout(() => dismiss(id), opts.action ? 4500 : 2600)
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, show, dismiss }
}

/** A light tap of haptic feedback where the device supports it. */
export function haptic(ms = 8) {
  navigator.vibrate?.(ms)
}
