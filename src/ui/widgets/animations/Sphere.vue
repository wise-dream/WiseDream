<!-- src/ui/widgets/three/Sphere.vue -->
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import type {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  Raycaster,
  BufferGeometry,
  BufferAttribute,
  Color
} from 'three'

interface Props {
  radius?: number
  detail?: number
  baseColor?: string
  highlightColor?: string
  dprCap?: number
  clickable?: boolean
  palette?: string[]
  cycleIntervalMs?: number
  transitionMs?: number
  animateIn?: boolean

  colorWheel?: boolean
  huePeriodMs?: number
  hueSaturation?: number
  hueLightness?: number

  autoRotate?: boolean
  autoRotateSpeed?: number
  inertia?: boolean
  inertiaFriction?: number
  maxAngularVelocity?: number
  pointerSensitivity?: number
}
const props = withDefaults(defineProps<Props>(), {
  radius: 1.0,
  detail: 1,
  baseColor: '#9aa7ff',
  highlightColor: '#ffffff',
  dprCap: 1.5,
  clickable: false,
  palette: () => ['#7C83FF', '#6BE7FF', '#6BFFA6', '#F6C177'],
  cycleIntervalMs: 3200,
  transitionMs: 900,
  animateIn: true,

  colorWheel: true,
  huePeriodMs: 12000,
  hueSaturation: 0.7,
  hueLightness: 0.55,

  autoRotate: true,
  autoRotateSpeed: 0.25,
  inertia: true,
  inertiaFriction: 3.0,
  maxAngularVelocity: 2.5,
  pointerSensitivity: Math.PI
})

const containerRef = ref<HTMLDivElement | null>(null)
const ready = ref(false)

let THREE: typeof import('three') | null = null
let renderer: WebGLRenderer | null = null
let scene: Scene | null = null
let camera: PerspectiveCamera | null = null
let mesh: Mesh | null = null
let raycaster: Raycaster | null = null
let colorsAttr: BufferAttribute | null = null
let resizeObs: ResizeObserver | null = null

let dragging = false
let lastDragT = 0
let startX = 0
let startY = 0

let hoveredFace = -1
let needsRender = true

let cycleTimer: number | null = null
let rafColor: number | null = null
let paletteIndex = 0

let rafHue: number | null = null
let hueStart = 0
let hueStartTime = 0

let rafMotion: number | null = null
let lastMotionT = 0
let angVelX = 0
let angVelY = 0

const scheduleRender = () => { needsRender = true; requestAnimationFrame(renderOnce) }
const renderOnce = () => {
  if (!needsRender || !renderer || !scene || !camera) return
  needsRender = false
  renderer.render(scene, camera)
  if (!ready.value) ready.value = true
}

const setFaceColor = (faceIndex: number, color: Color) => {
  if (!mesh || !colorsAttr) return
  const geom = mesh.geometry as BufferGeometry
  const index = geom.getIndex()
  if (!index) return
  const i0 = index.getX(faceIndex * 3 + 0)
  const i1 = index.getX(faceIndex * 3 + 1)
  const i2 = index.getX(faceIndex * 3 + 2)
  colorsAttr.setXYZ(i0, color.r, color.g, color.b)
  colorsAttr.setXYZ(i1, color.r, color.g, color.b)
  colorsAttr.setXYZ(i2, color.r, color.g, color.b)
}
const highlightFace = (faceIndex: number) => {
  if (!THREE || !mesh || !colorsAttr) return
  if (hoveredFace === faceIndex) return
  if (hoveredFace >= 0) setFaceColor(hoveredFace, new (THREE as any).Color(props.baseColor))
  if (faceIndex >= 0) setFaceColor(faceIndex, new (THREE as any).Color(props.highlightColor))
  hoveredFace = faceIndex
  colorsAttr.needsUpdate = true
  scheduleRender()
}

const hexToHsl = (c: string, T: typeof import('three')) => { const col = new T.Color(c); const hsl = { h: 0, s: 0, l: 0 }; (col as any).getHSL(hsl); return hsl }
const hslToColor = (h: number, s: number, l: number, T: typeof import('three')) => { const c = new T.Color(); c.setHSL(h, s, l); return c }
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

const startColorTransition = (fromHex: string, toHex: string) => {
  if (!THREE || !mesh || !colorsAttr) return
  const T = THREE as typeof import('three')
  const fromH = hexToHsl(fromHex, T)
  const toH = hexToHsl(toHex, T)

  let h1 = fromH.h
  let h2 = toH.h
  if (h2 <= h1) h2 += 1.0
  const s = (fromH.s + toH.s) * 0.5
  const l = (fromH.l + toH.l) * 0.5

  const start = performance.now()
  const dur = Math.max(120, props.transitionMs)

  const step = () => {
    if (!mesh || !colorsAttr) return
    const t = Math.min(1, (performance.now() - start) / dur)
    const k = easeOut(t)
    const hWrapped = (h1 + (h2 - h1) * k) % 1.0
    const col = hslToColor(hWrapped, s, l, T)
    const geom = mesh!.geometry as BufferGeometry
    const posAttr = geom.getAttribute('position') as BufferAttribute | undefined
    if (posAttr) {
      for (let i = 0; i < posAttr.count; i++) colorsAttr!.setXYZ(i, col.r, col.g, col.b)
      colorsAttr!.needsUpdate = true
    }
    scheduleRender()

    if (t < 1) {
      rafColor = requestAnimationFrame(step) as unknown as number
    } else {
      rafColor = null
      cycleTimer = window.setTimeout(() => {
        const pal = props.palette, len = pal.length
        if (!len) return
        const fromIdx = paletteIndex % len
        const toIdx = (paletteIndex + 1) % len
        const from = pal[fromIdx]!
        const to = pal[toIdx]!
        paletteIndex = toIdx
        startColorTransition(from, to)
      }, Math.max(600, props.cycleIntervalMs))
    }
  }

  if (rafColor) cancelAnimationFrame(rafColor)
  if (cycleTimer) { clearTimeout(cycleTimer); cycleTimer = null }
  rafColor = requestAnimationFrame(step) as unknown as number
}

const startHueLoop = () => {
  if (!THREE || !mesh || !colorsAttr) return
  const T = THREE as typeof import('three')
  const s = props.hueSaturation
  const l = props.hueLightness
  const period = Math.max(2000, props.huePeriodMs)

  if (!hueStartTime) hueStartTime = performance.now()

  const step = () => {
    if (!mesh || !colorsAttr) return
    const elapsed = performance.now() - hueStartTime
    const h = (hueStart + (elapsed / period)) % 1.0
    const col = hslToColor(h, s, l, T)

    const geom = mesh!.geometry as BufferGeometry
    const posAttr = geom.getAttribute('position') as BufferAttribute | undefined
    if (posAttr) {
      for (let i = 0; i < posAttr.count; i++) colorsAttr!.setXYZ(i, col.r, col.g, col.b)
      colorsAttr!.needsUpdate = true
    }
    scheduleRender()
    rafHue = requestAnimationFrame(step) as unknown as number
  }

  if (rafHue) cancelAnimationFrame(rafHue)
  rafHue = requestAnimationFrame(step) as unknown as number
}

const applyMotion = (dt: number) => {
  if (!mesh) return
  if (!dragging) {
    const base = props.autoRotate ? props.autoRotateSpeed : 0
    mesh.rotation.y += base * dt

    if (props.inertia) {
      mesh.rotation.y += angVelY * dt
      mesh.rotation.x += angVelX * dt
      const decay = Math.exp(-props.inertiaFriction * dt)
      angVelX *= decay
      angVelY *= decay
    }
  }
}

const maybeRunMotionLoop = () => {
  if (rafMotion) return
  lastMotionT = performance.now()
  const step = () => {
    if (!mesh) { rafMotion = null; return }
    const now = performance.now()
    const dt = Math.max(0, (now - lastMotionT) / 1000)
    lastMotionT = now

    applyMotion(dt)
    scheduleRender()

    const moving =
      props.autoRotate ||
      Math.abs(angVelX) > 0.01 ||
      Math.abs(angVelY) > 0.01 ||
      dragging

    if (moving) {
      rafMotion = requestAnimationFrame(step) as unknown as number
    } else {
      rafMotion = null
    }
  }
  rafMotion = requestAnimationFrame(step) as unknown as number
}

const animateIn = () => {
  if (!THREE || !mesh || !props.animateIn) return
  const start = performance.now()
  const dur = 420
  const initRy = -0.28, initRx = 0.12, initS = 0.94
  mesh.rotation.set(initRx, initRy, 0)
  mesh.scale.setScalar(initS)

  const step = () => {
    if (!mesh) return
    const t = Math.min(1, (performance.now() - start) / dur)
    const k = easeOut(t)
    mesh.rotation.y = initRy * (1 - k)
    mesh.rotation.x = initRx * (1 - k)
    const s = initS + (1 - initS) * k
    mesh.scale.setScalar(s)
    scheduleRender()
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

const init = async () => {
  const mod = await import('three'); THREE = mod
  const el = containerRef.value; if (!el || !THREE) return

  const dprCap = (navigator as any)?.connection?.saveData ? 1 : props.dprCap

  renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
    depth: true,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance'
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap))

  // ЕДИНСТВЕННОЕ объявление canvas
  const canvas = renderer.domElement as HTMLCanvasElement
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.display = 'block'
  ;(canvas.style as any).touchAction = 'none' // важно для тач-джестов
  el.appendChild(canvas)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100); camera.position.set(0, 0, 3)

  const hemi = new THREE.HemisphereLight(0xffffff, 0x223344, 0.55); scene.add(hemi)
  const dir = new THREE.DirectionalLight(0xffffff, 0.55); dir.position.set(2, 3, 4); scene.add(dir)

  const targetDetail = Math.max(0, Math.min(2, (el.clientWidth < 560) ? props.detail - 1 : props.detail))
  const geom = new THREE.IcosahedronGeometry(props.radius, targetDetail); geom.computeVertexNormals()
  const posAttr = geom.getAttribute('position') as BufferAttribute | undefined; if (!posAttr) return

  const baseHsl = hexToHsl(props.palette[0] ?? props.baseColor, THREE)
  hueStart = baseHsl.h

  const base = new THREE.Color().setHSL(hueStart, props.hueSaturation, props.hueLightness)
  const colors = new Float32Array(posAttr.count * 3)
  for (let i = 0; i < posAttr.count; i++) { colors[i * 3 + 0] = base.r; colors[i * 3 + 1] = base.g; colors[i * 3 + 2] = base.b }
  colorsAttr = new THREE.BufferAttribute(colors, 3); geom.setAttribute('color', colorsAttr)

  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true })
  mesh = new THREE.Mesh(geom, mat); mesh.renderOrder = 1; scene.add(mesh)

  raycaster = new THREE.Raycaster()

  const doResize = () => {
    if (!renderer || !camera) return
    const w = el.clientWidth || 300, h = el.clientHeight || 300
    renderer.setSize(w, h, true)
    camera.aspect = w / h; camera.updateProjectionMatrix()
    scheduleRender()
  }
  resizeObs = new ResizeObserver(doResize); resizeObs.observe(el); doResize()

  const getNdc = (x: number, y: number) => {
    const r = canvas.getBoundingClientRect()
    return { x: ((x - r.left) / r.width) * 2 - 1, y: -(((y - r.top) / r.height) * 2 - 1) }
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!THREE || !mesh || !camera || !raycaster) return
    if (e.pointerType === 'touch' && !e.isPrimary) return

    const cw = canvas.clientWidth || 1
    const ch = canvas.clientHeight || 1

    if (dragging) {
      e.preventDefault()
      const now = performance.now()
      const dt = Math.max(0.001, (now - lastDragT) / 1000)
      lastDragT = now

      const dx = (e.clientX - startX) / cw
      const dy = (e.clientY - startY) / ch
      startX = e.clientX
      startY = e.clientY

      const sens = props.pointerSensitivity
      const dYaw = dx * sens
      const dPitch = dy * sens

      mesh.rotation.y += dYaw
      mesh.rotation.x += dPitch

      if (props.inertia) {
        angVelY = clamp(dYaw / dt, -props.maxAngularVelocity, props.maxAngularVelocity)
        angVelX = clamp(dPitch / dt, -props.maxAngularVelocity, props.maxAngularVelocity)
        maybeRunMotionLoop()
      }

      scheduleRender()
      return
    }

    const p = getNdc(e.clientX, e.clientY)
    raycaster.setFromCamera(p as any, camera)
    const hit = raycaster.intersectObject(mesh, false)[0]
    highlightFace(hit?.faceIndex ?? -1)
  }

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'touch' && !e.isPrimary) return
    dragging = true
    startX = e.clientX
    startY = e.clientY
    lastDragT = performance.now()
    try { canvas.setPointerCapture(e.pointerId) } catch {}
    e.preventDefault()
  }

  const finishDrag = (e?: PointerEvent) => {
    if (!dragging) return
    dragging = false
    try { if (e) canvas.releasePointerCapture(e.pointerId) } catch {}
  }

  const onPointerUp = (e: PointerEvent) => {
    const wasDragging = dragging
    finishDrag(e)
    if (!props.clickable || wasDragging || !mesh || !camera || !raycaster) return
    const p = getNdc(e.clientX, e.clientY); raycaster.setFromCamera(p as any, camera)
    const hit = raycaster.intersectObject(mesh, false)[0]; if (typeof hit?.faceIndex === 'number') {}
  }

  const onPointerCancel = (e: PointerEvent) => { finishDrag(e) }
  const onLostCapture  = () => { dragging = false }

  canvas.addEventListener('pointermove', onPointerMove, { passive: false })
  canvas.addEventListener('pointerdown', onPointerDown, { passive: false })
  canvas.addEventListener('pointerup', onPointerUp, { passive: true })
  canvas.addEventListener('pointercancel', onPointerCancel, { passive: true })
  canvas.addEventListener('lostpointercapture', onLostCapture, { passive: true })

  scheduleRender()
  animateIn()

  if (props.colorWheel) {
    startHueLoop()
  } else {
    const pal = props.palette, len = pal.length
    if (len > 1) { const from = pal[0]!, to = pal[1]!; paletteIndex = 1; startColorTransition(from, to) }
  }

  maybeRunMotionLoop()

  onBeforeUnmount(() => {
    if (rafColor) cancelAnimationFrame(rafColor)
    if (cycleTimer) clearTimeout(cycleTimer)
    if (rafHue) cancelAnimationFrame(rafHue)
    if (rafMotion) cancelAnimationFrame(rafMotion)

    canvas.removeEventListener('pointermove', onPointerMove as any)
    canvas.removeEventListener('pointerdown', onPointerDown as any)
    canvas.removeEventListener('pointerup', onPointerUp as any)
    canvas.removeEventListener('pointercancel', onPointerCancel as any)
    canvas.removeEventListener('lostpointercapture', onLostCapture as any)

    resizeObs?.disconnect()
    if (scene && mesh) scene.remove(mesh)
    ;(geom as any)?.dispose?.(); (mat as any)?.dispose?.()
    renderer?.dispose()
    colorsAttr = null; mesh = null; scene = null; camera = null; renderer = null; raycaster = null
  })
}

onMounted(() => { init() })
</script>

<template>
  <div ref="containerRef" class="sphere-wrap relative w-full h-full overflow-hidden">
    <div
      v-show="!ready"
      class="pointer-events-none absolute inset-0 grid place-items-center"
      aria-hidden="true"
    >
      <div class="relative w-[40px] aspect-square">
        <div class="absolute inset-0 rounded-full aura"></div>
        <div class="absolute inset-0 rounded-full ring-spin"></div>
      </div>
      <span class="sr-only">Loading sphere…</span>
    </div>
  </div>
</template>

<style scoped>
.sphere-wrap {
  position: relative;
  cursor: pointer;
  user-select: none;
}
:deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
  touch-action: none; /* критично для мобильных свайпов */
}
.aura {
  background: radial-gradient(closest-side, rgba(124,131,255,.22), rgba(124,131,255,0) 70%);
  filter: blur(8px);
  opacity: .9;
}
.ring-spin {
  --c1: rgba(124,131,255,.6);
  --c2: rgba(124,131,255,0);
  background: conic-gradient(from 0deg, var(--c1), var(--c2) 35%, var(--c2) 65%, var(--c1));
  mask: radial-gradient(closest-side, transparent 55%, #000 58%);
  -webkit-mask: radial-gradient(closest-side, transparent 55%, #000 58%);
  animation: spin 1.6s linear infinite;
  opacity: .65;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
