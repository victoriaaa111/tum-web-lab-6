export const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Arms', 'Triceps', 'Biceps',
  'Core', 'Legs', 'Glutes', 'Full Body',
  'Cardio', 'Other',
]

export function createExercise(index = 0) {
  return {
    id: Date.now().toString() + index,
    name: '',
    sets: 3,
    reps: 16,
  }
}

export function createWorkout(overrides = {}) {
  return {
    id: Date.now().toString(),
    title: '',
    tags: [],
    exercises: [createExercise(0)],
    favorite: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}
