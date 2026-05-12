import { apiRequest } from './apiClient'

export function listSessions({ page = 0, size = 20, tags = [], dateFrom, dateTo } = {}) {
  const params = new URLSearchParams({ page, size })
  tags.forEach(t => params.append('tags', t))
  if (dateFrom) params.set('from', `${dateFrom}T00:00:00Z`)
  if (dateTo) params.set('to', `${dateTo}T23:59:59Z`)
  return apiRequest(`/sessions?${params}`)
}

export function createSession(data) {
  return apiRequest('/sessions', { method: 'POST', body: JSON.stringify(data) })
}

export function deleteSession(id) {
  return apiRequest(`/sessions/${id}`, { method: 'DELETE' })
}
