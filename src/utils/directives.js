import { createLazyObserver } from './performance'

/**
 * Custom directives for the application
 */

/**
 * Lazy loading directive for images
 * Usage: v-lazy="imageUrl"
 */
export const lazyLoad = {
  beforeMount(el, binding) {
    el.classList.add('lazy-image')
    el.dataset.src = binding.value
    el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRTJFMkUyIi8+Cjwvc3ZnPgo='
    
    // If IntersectionObserver is not supported, load image immediately
    if (!('IntersectionObserver' in window)) {
      el.src = binding.value
      return
    }
    
    // Create observer to lazy load the image
    const observer = createLazyObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.add('lazy-loaded')
          observer.unobserve(img)
        }
      })
    })
    
    observer.observe(el)
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      el.dataset.src = binding.value
      
      if (el.classList.contains('lazy-loaded')) {
        el.src = binding.value
      }
    }
  }
}

/**
 * Click outside directive
 * Usage: v-click-outside="handlerFunction"
 */
export const clickOutside = {
  beforeMount(el, binding) {
    el._clickOutsideHandler = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler)
    delete el._clickOutsideHandler
  }
}

/**
 * Resize observer directive
 * Usage: v-resize="handlerFunction"
 */
export const resize = {
  beforeMount(el, binding) {
    el._resizeObserver = new ResizeObserver((entries) => {
      binding.value(entries[0].contentRect, el)
    })
    el._resizeObserver.observe(el)
  },
  unmounted(el) {
    if (el._resizeObserver) {
      el._resizeObserver.disconnect()
      delete el._resizeObserver
    }
  }
}

/**
 * Long press directive
 * Usage: v-long-press="{ handler: handlerFunction, duration: 1000 }"
 */
export const longPress = {
  beforeMount(el, binding) {
    if (typeof binding.value === 'object') {
      const { handler, duration = 1000 } = binding.value
      
      let pressTimer = null
      
      el._touchStartHandler = () => {
        pressTimer = setTimeout(() => {
          handler()
        }, duration)
      }
      
      el._touchEndHandler = () => {
        clearTimeout(pressTimer)
      }
      
      el.addEventListener('touchstart', el._touchStartHandler)
      el.addEventListener('mousedown', el._touchStartHandler)
      
      el.addEventListener('touchend', el._touchEndHandler)
      el.addEventListener('mouseup', el._touchEndHandler)
      el.addEventListener('mouseleave', el._touchEndHandler)
    }
  },
  unmounted(el) {
    el.removeEventListener('touchstart', el._touchStartHandler)
    el.removeEventListener('mousedown', el._touchStartHandler)
    
    el.removeEventListener('touchend', el._touchEndHandler)
    el.removeEventListener('mouseup', el._touchEndHandler)
    el.removeEventListener('mouseleave', el._touchEndHandler)
    
    delete el._touchStartHandler
    delete el._touchEndHandler
  }
}

// Export all directives
export default {
  lazyLoad,
  clickOutside,
  resize,
  longPress
} 