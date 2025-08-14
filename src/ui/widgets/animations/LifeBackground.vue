<!-- src/ui/widgets/LifeBackground.vue -->
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

interface Props {
  cellSize?: number
  fps?: number
  opacity?: number
  blurPx?: number
  colorMode?: 'hue' | 'palette'
  palette?: string[]
  seedDensity?: number
  reseedEveryMs?: number
  reducedMotionStop?: boolean
  blendMode?: 'normal' | 'screen' | 'lighten' | 'overlay' | 'soft-light'
  /** << NEW */
  fixed?: boolean
  zIndex?: number
}
const props = withDefaults(defineProps<Props>(), {
  cellSize: 22,
  fps: 12,
  opacity: 0.12,
  blurPx: 6,
  colorMode: 'hue',
  palette: () => ['#7C83FF', '#6BE7FF', '#6BFFA6', '#F6C177', '#F77AB6'],
  seedDensity: 0.18,
  reseedEveryMs: 16000,
  reducedMotionStop: true,
  blendMode: 'normal',
  fixed: true,       // по умолчанию делаем фоном экрана
  zIndex: -1         // под основным контентом, но над background-цветом body
})

const wrapRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let ro: ResizeObserver | null = null

let cols = 0, rows = 0
let grid: Uint8Array | null = null
let nextGrid: Uint8Array | null = null
let age: Uint8Array | null = null

let rafId: number | null = null
let lastStep = 0
let lastReseed = 0

const activeByPrefs = (): boolean => {
  const saveData = (navigator as any)?.connection?.saveData
  const m = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  if (props.reducedMotionStop && m?.matches) return false
  if (saveData === true) return false
  return true
}

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h * 12) % 12
    const c = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))
    return Math.round(c * 255)
  }
  return [f(0), f(8), f(4)]
}
const hexToRgb = (hex: string): [number, number, number] => {
  const m = hex.replace('#', '')
  const v = m.length === 3
    ? m.split('').map(c => parseInt(c + c, 16))
    : [parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16)]
  return [v[0] || 0, v[1] || 0, v[2] || 0]
}

const seedRandom = (density: number) => {
  if (!grid || !age) return
  const G = grid, A = age
  for (let i = 0; i < G.length; i++) {
    const alive = Math.random() < density ? 1 : 0
    G[i] = alive
    A[i] = alive ? (1 + (Math.random() * 6) | 0) : 0
  }
}

const alloc = (w: number, h: number) => {
  cols = Math.max(1, w | 0)
  rows = Math.max(1, h | 0)
  grid = new Uint8Array(cols * rows)
  nextGrid = new Uint8Array(cols * rows)
  age = new Uint8Array(cols * rows)
  seedRandom(props.seedDensity)
  lastReseed = performance.now()
}

const resize = () => {
  const el = wrapRef.value, cvs = canvasRef.value
  if (!el || !cvs) return
  const rect = el.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  cvs.width = Math.max(1, Math.round(rect.width * dpr))
  cvs.height = Math.max(1, Math.round(rect.height * dpr))
  cvs.style.width = `${Math.round(rect.width)}px`
  cvs.style.height = `${Math.round(rect.height)}px`
  ctx = cvs.getContext('2d')
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingEnabled = false
  }
  const c = Math.max(1, Math.floor(rect.width / props.cellSize))
  const r = Math.max(1, Math.floor(rect.height / props.cellSize))
  alloc(c, r)
}

const stepLife = () => {
  if (!grid || !nextGrid || !age) return
  const G = grid as Uint8Array
  const N = nextGrid as Uint8Array
  const A = age as Uint8Array
  const w = cols, h = rows
  const read = (xx: number, yy: number): number => G[yy * w + xx] ?? 0

  for (let y = 0; y < h; y++) {
    const ym = (y - 1 + h) % h
    const yp = (y + 1) % h
    for (let x = 0; x < w; x++) {
      const xm = (x - 1 + w) % w
      const xp = (x + 1) % w
      const i = y * w + x
      const n =
        read(xm, ym) + read(x, ym) + read(xp, ym) +
        read(xm, y)  + read(xp, y) +
        read(xm, yp) + read(x, yp) + read(xp, yp)
      const alive = (G[i] ?? 0) === 1
      const willLive = alive ? (n === 2 || n === 3) : (n === 3)
      N[i] = willLive ? 1 : 0
      A[i] = willLive ? Math.min(255, (A[i] ?? 0) + 1) : 0
    }
  }
  grid = N
  nextGrid = G
}

const draw = (t: number) => {
  if (!ctx || !grid) return
  const C = ctx
  const G = grid as Uint8Array
  const A = age as Uint8Array | null
  const el = wrapRef.value; if (!el) return

  const wpx = el.clientWidth, hpx = el.clientHeight
  const w = cols, h = rows, cs = props.cellSize

  C.clearRect(0, 0, wpx, hpx)
  C.globalCompositeOperation = 'source-over'
  C.globalAlpha = props.opacity

  if (props.colorMode === 'palette') {
    const basePalette = (props.palette?.length ? props.palette : ['#7C83FF'])
    const pal = basePalette.map(hexToRgb) as [number, number, number][]
    const plen = pal.length
    const fallback: [number, number, number] = pal[0] ?? [124, 131, 255]
    const getColor = (i: number): [number, number, number] => pal[((i % plen) + plen) % plen] ?? fallback

    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x; if (!(G[i] ?? 0)) continue
      const ag = A ? (A[i] ?? 0) : 1
      const [r, g, b] = getColor(x + y + ag)
      C.fillStyle = `rgb(${r},${g},${b})`
      C.fillRect(x * cs, y * cs, cs, cs)
    }
  } else {
    const base = (t * 0.00005) % 1
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x; if (!(G[i] ?? 0)) continue
      const ag = A ? (A[i] ?? 0) : 1
      const hue = (base + (x / w) * 0.25 + (y / h) * 0.25 + ag * 0.002) % 1
      const [r, g, b] = hslToRgb(hue, 0.6, 0.38)
      C.fillStyle = `rgb(${r},${g},${b})`
      C.fillRect(x * cs, y * cs, cs, cs)
    }
  }
}

/* ===== рисование курсором (работает и с fixed, т.к. слушаем window) ===== */
const setCellAlive = (x: number, y: number, vitality = 6) => {
  if (!grid || !age) return
  const G = grid as Uint8Array, A = age as Uint8Array
  const w = cols, h = rows
  const xx = ((x % w) + w) % w, yy = ((y % h) + h) % h
  const i = yy * w + xx
  G[i] = 1; A[i] = Math.min(255, (A[i] ?? 0) + vitality)
}
const brushRCells = 2, brushDensity = 0.85, brushVitality = 6
let lastPaint = 0
const paintThrottleMs = 30
const paintLifeAtPx = (px: number, py: number) => {
  const host = wrapRef.value; if (!host || !grid || !age) return
  const rect = host.getBoundingClientRect()
  if (px < 0 || py < 0 || px > rect.width || py > rect.height) return
  const cs = props.cellSize
  const cx = Math.floor(px / cs), cy = Math.floor(py / cs)
  for (let dy = -brushRCells; dy <= brushRCells; dy++)
    for (let dx = -brushRCells; dx <= brushRCells; dx++) {
      if (dx*dx + dy*dy > brushRCells*brushRCells) continue
      if (Math.random() > brushDensity) continue
      setCellAlive(cx + dx, cy + dy, brushVitality)
    }
}
const onPointerMovePaint = (e: PointerEvent) => {
  const now = performance.now(); if (now - lastPaint < paintThrottleMs) return
  lastPaint = now
  const host = wrapRef.value; if (!host) return
  const rect = host.getBoundingClientRect()
  paintLifeAtPx(e.clientX - rect.left, e.clientY - rect.top)
}
/* ======================================================================= */

const loop = (now: number) => {
  const targetDt = 1000 / props.fps
  if (!lastStep) lastStep = now
  if (now - lastStep >= targetDt) { stepLife(); draw(now); lastStep = now }
  if (props.reseedEveryMs > 0 && now - lastReseed > props.reseedEveryMs) {
    seedRandom(0.08 + Math.random() * 0.12)
    lastReseed = now
  }
  rafId = requestAnimationFrame(loop) as unknown as number
}

onMounted(() => {
  if (!activeByPrefs()) return
  resize()
  ro = new ResizeObserver(() => resize())
  if (wrapRef.value) ro.observe(wrapRef.value)
  rafId = requestAnimationFrame(loop) as unknown as number
  window.addEventListener('pointermove', onPointerMovePaint, { passive: true })
})
onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  ro?.disconnect()
  window.removeEventListener('pointermove', onPointerMovePaint as any)
  ctx = null; grid = nextGrid = age = null
})
</script>

<template>
  <!-- fixed фон: телепортируемся в body -->
  <teleport v-if="fixed" to="body">
    <div
      ref="wrapRef"
      class="lifebg fixed inset-0 pointer-events-none"
      :style="{ zIndex: String(zIndex) }"
      aria-hidden="true"
    >
      <canvas
        ref="canvasRef"
        class="w-full h-full"
        :style="{ filter: `blur(${blurPx}px)`, mixBlendMode: blendMode }"
      />
    </div>
  </teleport>

  <!-- обычный режим: как раньше, относительно контейнера -->
  <div
    v-else
    ref="wrapRef"
    class="lifebg absolute inset-0 pointer-events-none"
    aria-hidden="true"
  >
    <canvas
      ref="canvasRef"
      class="w-full h-full"
      :style="{ filter: `blur(${blurPx}px)`, mixBlendMode: blendMode }"
    />
  </div>
</template>

<style scoped>
.lifebg { /* слой можно переопределить через prop zIndex */ }
</style>
