import { apiRequest } from './apiClient'

export function listUsers({ page = 0, size = 20 } = {}) {
  const params = new URLSearchParams({ page, size })
  return apiRequest(`/admin/users?${params}`)
}

export function updateUserRole(id, role) {
  return apiRequest(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify({ role }) })
}

export function deleteUser(id) {
  return apiRequest(`/admin/users/${id}`, { method: 'DELETE' })
}

export function getUserWorkouts(id, { page = 0, size = 5 } = {}) {
  const params = new URLSearchParams({ page, size })
  return apiRequest(`/admin/users/${id}/workouts?${params}`)
}

export function getUserSessions(id, { page = 0, size = 5 } = {}) {
  const params = new URLSearchParams({ page, size })
  return apiRequest(`/admin/users/${id}/sessions?${params}`)
}
