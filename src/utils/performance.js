/**
 * Performance utilities for the application
 */

/**
 * Throttles a function to only run once within the specified time interval
 * @param {Function} func - The function to throttle
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} - The throttled function
 */
export function throttle(func, delay) {
  let lastCall = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      return func.apply(this, args)
    }
  }
}

/**
 * Debounces a function to only run after waiting for a specified time
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
export function debounce(func, delay) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * Lazy loads an image and returns a promise
 * @param {string} src - The image source
 * @returns {Promise} - A promise that resolves when the image is loaded
 */
export function lazyLoadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Enables hardware acceleration for animations
 * @param {HTMLElement} element - The element to optimize
 */
export function enableHardwareAcceleration(element = document.body) {
  element.style.transform = 'translateZ(0)'
  element.style.backfaceVisibility = 'hidden'
  element.style.perspective = '1000px'
}

/**
 * Measures the performance of a function
 * @param {Function} func - The function to measure
 * @param {any[]} args - Arguments to pass to the function
 * @returns {[any, number]} - The function result and the execution time
 */
export function measurePerformance(func, ...args) {
  const start = performance.now()
  const result = func(...args)
  const executionTime = performance.now() - start
  console.log(`Function executed in ${executionTime.toFixed(2)}ms`)
  return [result, executionTime]
}

/**
 * Creates an intersection observer for lazy loading elements
 * @param {Function} callback - The callback function
 * @param {Object} options - Intersection observer options
 * @returns {IntersectionObserver} - The intersection observer instance
 */
export function createLazyObserver(callback, options = {}) {
  return new IntersectionObserver(callback, {
    rootMargin: '100px',
    threshold: 0,
    ...options
  })
} 