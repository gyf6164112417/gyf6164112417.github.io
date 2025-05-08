import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { debounce } from './performance'
import api from './api'

/**
 * Composable for data fetching with loading and error states
 * @param {Function} fetchFunction - The function to fetch data
 * @param {Object} options - Options for the fetcher
 * @returns {Object} - The fetcher object
 */
export function useFetcher(fetchFunction, options = {}) {
  const {
    immediate = true,
    initialData = null,
    transformResponse = data => data,
    onSuccess = () => {},
    onError = () => {},
    dedupingInterval = 0
  } = options
  
  const data = ref(initialData)
  const loading = ref(false)
  const error = ref(null)
  const lastFetchTime = ref(0)
  
  const fetch = async (...args) => {
    // Implement request deduping
    const now = Date.now()
    if (dedupingInterval > 0 && now - lastFetchTime.value < dedupingInterval) {
      return data.value
    }
    
    loading.value = true
    error.value = null
    
    try {
      const response = await fetchFunction(...args)
      data.value = transformResponse(response)
      lastFetchTime.value = Date.now()
      onSuccess(data.value)
      return data.value
    } catch (err) {
      error.value = err
      onError(err)
      return null
    } finally {
      loading.value = false
    }
  }
  
  if (immediate) {
    onMounted(fetch)
  }
  
  return {
    data,
    loading,
    error,
    fetch,
    reset: () => {
      data.value = initialData
      error.value = null
    }
  }
}

/**
 * Composable for pagination
 * @param {Function} fetchFunction - The function to fetch data
 * @param {Object} options - Options for pagination
 * @returns {Object} - The pagination object
 */
export function usePagination(fetchFunction, options = {}) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    initialTotal = 0,
    immediate = true
  } = options
  
  const page = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const total = ref(initialTotal)
  const data = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
  const isFirstPage = computed(() => page.value === 1)
  const isLastPage = computed(() => page.value >= totalPages.value)
  const pageItems = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return data.value.slice(start, start + pageSize.value)
  })
  
  const fetch = async (newPage = page.value) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetchFunction({
        page: newPage,
        pageSize: pageSize.value
      })
      
      if (response && response.data) {
        data.value = response.data
        total.value = response.total || response.data.length
        page.value = newPage
      }
      
      return response
    } catch (err) {
      error.value = err
      return null
    } finally {
      loading.value = false
    }
  }
  
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
      return fetch(newPage)
    }
  }
  
  const nextPage = () => {
    if (!isLastPage.value) {
      return goToPage(page.value + 1)
    }
  }
  
  const prevPage = () => {
    if (!isFirstPage.value) {
      return goToPage(page.value - 1)
    }
  }
  
  if (immediate) {
    onMounted(() => fetch())
  }
  
  return {
    page,
    pageSize,
    total,
    data,
    loading,
    error,
    totalPages,
    isFirstPage,
    isLastPage,
    pageItems,
    fetch,
    goToPage,
    nextPage,
    prevPage,
    setPageSize: (size) => {
      pageSize.value = size
      return fetch(1)
    }
  }
}

/**
 * Composable for form handling
 * @param {Object} initialValues - Initial form values
 * @param {Function} validateFunction - Function to validate form
 * @param {Function} submitFunction - Function to submit form
 * @returns {Object} - The form handler
 */
export function useForm(initialValues = {}, validateFunction = null, submitFunction = null) {
  const values = ref({ ...initialValues })
  const errors = ref({})
  const touched = ref({})
  const submitting = ref(false)
  const submitted = ref(false)
  
  const resetForm = () => {
    values.value = { ...initialValues }
    errors.value = {}
    touched.value = {}
    submitted.value = false
  }
  
  const setFieldValue = (field, value) => {
    values.value[field] = value
    validateField(field)
  }
  
  const setFieldTouched = (field, isTouched = true) => {
    touched.value[field] = isTouched
    if (isTouched) {
      validateField(field)
    }
  }
  
  const validateField = async (field) => {
    if (!validateFunction) return true
    
    const fieldErrors = await validateFunction(values.value, field)
    if (field) {
      errors.value[field] = fieldErrors?.[field] || null
      return !errors.value[field]
    }
    
    errors.value = fieldErrors || {}
    return Object.keys(errors.value).length === 0
  }
  
  const validate = async () => {
    return validateField()
  }
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    
    submitted.value = true
    
    // Mark all fields as touched
    Object.keys(values.value).forEach(field => {
      touched.value[field] = true
    })
    
    const isValid = await validate()
    if (!isValid) return false
    
    if (submitFunction) {
      submitting.value = true
      try {
        await submitFunction(values.value)
        return true
      } catch (error) {
        return false
      } finally {
        submitting.value = false
      }
    }
    
    return true
  }
  
  return {
    values,
    errors,
    touched,
    submitting,
    submitted,
    setFieldValue,
    setFieldTouched,
    validate,
    handleSubmit,
    resetForm
  }
}

/**
 * Composable for window resize events
 * @returns {Object} - The window size object
 */
export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)
  
  const onResize = debounce(() => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }, 150)
  
  onMounted(() => {
    window.addEventListener('resize', onResize)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
  })
  
  return {
    width,
    height,
    isMobile: computed(() => width.value < 768),
    isTablet: computed(() => width.value >= 768 && width.value < 1024),
    isDesktop: computed(() => width.value >= 1024)
  }
}

/**
 * Composable for image lazy loading
 * @param {String} src - Image source
 * @returns {Object} - The image object
 */
export function useLazyImage(src) {
  const loaded = ref(false)
  const error = ref(false)
  const imageSrc = ref('')
  
  const loadImage = () => {
    const img = new Image()
    img.onload = () => {
      imageSrc.value = src
      loaded.value = true
    }
    img.onerror = () => {
      error.value = true
    }
    img.src = src
  }
  
  onMounted(loadImage)
  
  return {
    loaded,
    error,
    imageSrc
  }
} 