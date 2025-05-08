/**
 * API utilities for the application
 */

// Base API configuration
const API_CONFIG = {
  baseUrl: process.env.VUE_APP_API_URL || '/api',
  timeout: 30000,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

/**
 * Creates headers for API requests
 * @param {Object} customHeaders - Custom headers to include
 * @returns {Headers} - Headers object
 */
function createHeaders(customHeaders = {}) {
  const headers = new Headers(API_CONFIG.defaultHeaders)
  
  // Add auth token if available
  const token = localStorage.getItem('auth_token')
  if (token) {
    headers.append('Authorization', `Bearer ${token}`)
  }
  
  // Add custom headers
  Object.entries(customHeaders).forEach(([key, value]) => {
    headers.append(key, value)
  })
  
  return headers
}

/**
 * Makes a fetch request with timeout
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} - Promise that resolves to the response
 */
async function fetchWithTimeout(url, options) {
  const controller = new AbortController()
  const { signal } = controller
  
  const timeout = setTimeout(() => {
    controller.abort()
  }, options.timeout || API_CONFIG.timeout)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal
    })
    clearTimeout(timeout)
    return response
  } catch (error) {
    clearTimeout(timeout)
    if (error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

/**
 * Handles API response
 * @param {Response} response - Fetch response
 * @returns {Promise} - Promise that resolves to the response data
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type')
  
  if (!response.ok) {
    const error = {
      status: response.status,
      statusText: response.statusText,
      data: null
    }
    
    try {
      if (contentType?.includes('application/json')) {
        error.data = await response.json()
      } else {
        error.data = await response.text()
      }
    } catch (e) {
      error.data = 'Could not parse error response'
    }
    
    throw error
  }
  
  if (contentType?.includes('application/json')) {
    return await response.json()
  }
  
  if (contentType?.includes('text/')) {
    return await response.text()
  }
  
  return response
}

/**
 * Generic request function
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request data
 * @param {Object} options - Additional options
 * @returns {Promise} - Promise that resolves to the response data
 */
async function request(method, endpoint, data = null, options = {}) {
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_CONFIG.baseUrl}${endpoint}`
  
  const fetchOptions = {
    method,
    headers: createHeaders(options.headers),
    credentials: options.credentials || 'same-origin',
    timeout: options.timeout || API_CONFIG.timeout,
  }
  
  if (data) {
    if (method === 'GET' || method === 'DELETE') {
      const params = new URLSearchParams()
      Object.entries(data).forEach(([key, value]) => {
        params.append(key, value)
      })
      const queryString = params.toString()
      if (queryString) {
        endpoint += `?${queryString}`
      }
    } else if (options.isFormData) {
      fetchOptions.body = data
    } else {
      fetchOptions.body = JSON.stringify(data)
    }
  }
  
  const response = await fetchWithTimeout(url, fetchOptions)
  return handleResponse(response)
}

// Export API methods
export default {
  get: (endpoint, data, options) => request('GET', endpoint, data, options),
  post: (endpoint, data, options) => request('POST', endpoint, data, options),
  put: (endpoint, data, options) => request('PUT', endpoint, data, options),
  patch: (endpoint, data, options) => request('PATCH', endpoint, data, options),
  delete: (endpoint, data, options) => request('DELETE', endpoint, data, options),
  
  // Helper for file uploads
  uploadFile: (endpoint, formData, options = {}) => {
    return request('POST', endpoint, formData, {
      ...options,
      isFormData: true,
      headers: { ...options.headers, 'Content-Type': 'multipart/form-data' }
    })
  }
} 