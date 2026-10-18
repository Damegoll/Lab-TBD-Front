const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

let onUnauthorized = () => {}

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    if (response.status === 401 && token) onUnauthorized()

    let mensaje = `Error ${response.status}`
    try {
      const body = await response.json()
      if (body?.message) mensaje = body.message
    } catch {
      // la respuesta no traía JSON: dejamos el mensaje genérico
    }
    if (response.status === 403) mensaje = 'No tienes permisos para esta acción'
    throw new Error(mensaje)
  }

  // 204 No Content (por ejemplo, en DELETE)
  return response.status === 204 ? null : response.json()
}

export const http = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
