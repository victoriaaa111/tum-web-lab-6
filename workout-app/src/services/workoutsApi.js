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

export function addExercise(workoutId, data) {
  return apiRequest(`/workouts/${workoutId}/exercises`, { method: 'POST', body: JSON.stringify(data) })
}

export function updateExercise(workoutId, exId, data) {
  return apiRequest(`/workouts/${workoutId}/exercises/${exId}`, { method: 'PATCH', body: JSON.stringify(data) })
}

export function deleteExercise(workoutId, exId) {
  return apiRequest(`/workouts/${workoutId}/exercises/${exId}`, { method: 'DELETE' })
}

export async function updateWorkoutWithExercises(workoutId, formData, originalExercises) {
  await apiRequest(`/workouts/${workoutId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title: formData.title, tags: formData.tags }),
  })

  const originalIds = new Set(originalExercises.map(e => String(e.id)))

  for (const orig of originalExercises) {
    if (!formData.exercises.some(e => String(e.id) === String(orig.id))) {
      await deleteExercise(workoutId, orig.id)
    }
  }

  for (const ex of formData.exercises) {
    const { name, sets, reps } = ex
    if (originalIds.has(String(ex.id))) {
      await updateExercise(workoutId, ex.id, { name, sets, reps })
    } else {
      await addExercise(workoutId, { name, sets, reps })
    }
  }
}