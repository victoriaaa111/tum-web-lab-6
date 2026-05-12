import { apiRequest } from './apiClient'

export function listWorkouts({ page = 0, size = 20, tags = [], favorite } = {}) {
  const params = new URLSearchParams({ page, size })
  tags.forEach(t => params.append('tags', t))
  if (favorite) params.set('favorite', 'true')
  return apiRequest(`/workouts?${params}`)
}

export function createWorkout(data) {
  return apiRequest('/workouts', { method: 'POST', body: JSON.stringify(data) })
}

export function updateWorkout(id, data) {
  return apiRequest(`/workouts/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
}

export function deleteWorkout(id) {
  return apiRequest(`/workouts/${id}`, { method: 'DELETE' })
}

export function importWorkouts(data) {
  return apiRequest('/workouts/import', { method: 'POST', body: JSON.stringify(data) })
}
