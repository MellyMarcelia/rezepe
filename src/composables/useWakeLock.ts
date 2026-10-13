import { onBeforeUnmount, onMounted, ref } from 'vue'

/** Keeps the tablet screen on while cooking, re-acquiring the lock when the tab becomes visible again. */
export function useWakeLock() {
  const active = ref(false)
  let sentinel: WakeLockSentinel | null = null

  async function request() {
    if (!('wakeLock' in navigator)) return
    try {
      sentinel = await navigator.wakeLock.request('screen')
      active.value = true
      sentinel.addEventListener('release', () => (active.value = false))
    } catch {
      active.value = false
    }
  }

  function onVisibility() {
    if (document.visibilityState === 'visible' && (!sentinel || sentinel.released)) request()
  }

  onMounted(() => {
    request()
    document.addEventListener('visibilitychange', onVisibility)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', onVisibility)
    sentinel?.release()
  })

  return { active }
}
