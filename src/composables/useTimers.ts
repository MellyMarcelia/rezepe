import { onBeforeUnmount, ref } from 'vue'
import { speak } from './useVoice'

export interface KitchenTimer {
  id: number
  label: string
  endsAt: number
  remaining: number
  done: boolean
}

export function useTimers() {
  const timers = ref<KitchenTimer[]>([])
  let nextId = 1

  const tick = window.setInterval(() => {
    const now = Date.now()
    for (const t of timers.value) {
      if (t.done) continue
      t.remaining = (t.endsAt - now) / 1000
      if (t.remaining <= 0) {
        t.done = true
        speak(`Timer done: ${t.label}`)
        navigator.vibrate?.([300, 150, 300])
      }
    }
  }, 250)

  function add(label: string, seconds: number) {
    timers.value.push({
      id: nextId++,
      label,
      endsAt: Date.now() + seconds * 1000,
      remaining: seconds,
      done: false,
    })
  }

  function remove(id: number) {
    timers.value = timers.value.filter((t) => t.id !== id)
  }

  onBeforeUnmount(() => window.clearInterval(tick))

  return { timers, add, remove }
}
