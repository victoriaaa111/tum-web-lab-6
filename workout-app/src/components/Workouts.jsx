import { useState } from 'react'
import { createWorkout } from '../utils/workout'
import WorkoutCard from './WorkoutCard'
import AddWorkoutModal from './AddWorkoutModal'

const KEY = 'workout-journal-workouts'

function load() {
  try {
    const stored = localStorage.getItem(KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export default function Workouts({ addOpen, onCloseAdd }) {
  const [workouts, setWorkouts] = useState(load)

  function save(updated) {
    setWorkouts(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  function add(data = {}) {
    save([createWorkout(data), ...workouts])
  }

  function remove(id) {
    save(workouts.filter(w => w.id !== id))
  }

  function toggleFavorite(id) {
    save(workouts.map(w => w.id === id ? { ...w, favorite: !w.favorite } : w))
  }

  function importWorkouts(incoming) {
    const existingIds = new Set(workouts.map(w => w.id))
    save([...workouts, ...incoming.filter(w => !existingIds.has(w.id))])
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {workouts.map(workout => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onRemove={remove}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      <AddWorkoutModal
        isOpen={addOpen}
        onSave={data => { add(data); onCloseAdd() }}
        onClose={onCloseAdd}
      />
    </>
  )
}
