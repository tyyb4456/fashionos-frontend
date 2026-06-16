import { useAuth } from '@clerk/clerk-react'

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  // Check if we are running locally (npm run dev)
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8080'
  }
  // Fallback to your ngrok URL for Vercel/mobile testing
  return 'https://rinsing-treat-glitzy.ngrok-free.dev'
}

const API_BASE = getApiBase()

export function useApi() {
  const { getToken } = useAuth()

  const request = async (method, path, body = null) => {
    const token = await getToken()

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : null,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
      throw new Error(err.detail || `HTTP ${res.status}`)
    }
    if (res.status === 204) return null
    return res.json()
  }

  return {
    get:   (path)       => request('GET',    path),
    post:  (path, body) => request('POST',   path, body),
    put:   (path, body) => request('PUT',    path, body),
    patch: (path, body) => request('PATCH',  path, body),
    del:   (path)       => request('DELETE', path),
  }
}