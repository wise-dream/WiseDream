import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const bp = 768

  const isMobile = ref(false)
  const isMenuOpen = ref(false)
  const headerElevated = ref(false)

  const canUseDOM = () => typeof window !== 'undefined'

  const recalcIsMobile = () => {
    if (!canUseDOM()) return
    isMobile.value = window.innerWidth < bp
  }

  const recalcHeaderElevated = () => {
    if (!canUseDOM()) return
    headerElevated.value = window.scrollY > 8
  }

  const openMenu = () => { isMenuOpen.value = true }
  const closeMenu = () => { isMenuOpen.value = false }
  const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }
  
  const bindListeners = () => {
    if (!canUseDOM()) return () => {}
    recalcIsMobile()
    recalcHeaderElevated()

    const onResize = () => {
      const wasMobile = isMobile.value
      recalcIsMobile()
      if (wasMobile && !isMobile.value) closeMenu()
    }
    const onScroll = () => recalcHeaderElevated()

    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }

  const isDesktop = computed(() => !isMobile.value)

  return {
    isMobile,
    isDesktop,
    isMenuOpen,
    headerElevated,

    openMenu,
    closeMenu,
    toggleMenu,
    bindListeners
  }
})
