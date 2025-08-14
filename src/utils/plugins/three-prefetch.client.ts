// plugins/three-prefetch.client.ts
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(() => {
  const prefetch = () => import('three').catch(() => { })

  const nav = (navigator as any)
  const saveData = Boolean(nav?.connection?.saveData)
  const downlink = Number(nav?.connection?.downlink ?? 10)

  if (saveData || downlink < 1.5) return

  const ric =
    typeof window.requestIdleCallback === 'function'
      ? window.requestIdleCallback.bind(window)
      : null

  if (ric) {
    ric(() => { void prefetch() }, { timeout: 1200 })
  } else {
    setTimeout(() => { void prefetch() }, 600)
  }
})
