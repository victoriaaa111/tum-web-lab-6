import { useState } from 'react'
import { createWorkout } from '../utils/workout'
import WorkoutCard from './WorkoutCard'
import AddWorkoutModal from './AddWorkoutModal'
import FilterBar from './FilterBar'

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
  const [editTarget, setEditTarget] = useState(null)
  const [activeTags, setActiveTags] = useState([])
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  function save(updated) {
    setWorkouts(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  function add(data = {}) {
    save([createWorkout(data), ...workouts])
  }

  function update(id, data) {
    save(workouts.map(w => w.id === id ? { ...w, ...data } : w))
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

  function handleSave(data) {
    if (editTarget) {
      update(editTarget.id, data)
      setEditTarget(null)
    } else {
      add(data)
      onCloseAdd()
    }
  }

  function handleClose() {
    setEditTarget(null)
    onCloseAdd()
  }

  const filtered = workouts
    .filter(w => !favoritesOnly || w.favorite)
    .filter(w => activeTags.length === 0 || w.tags.some(t => activeTags.includes(t)))

  function toggleTag(tag) {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  return (
    <>
      <FilterBar
        activeTags={activeTags}
        favoritesOnly={favoritesOnly}
        onToggleTag={toggleTag}
        onToggleFavorites={() => setFavoritesOnly(f => !f)}
      />

      <div className="flex flex-col gap-4">
        {filtered.map(workout => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onRemove={remove}
            onToggleFavorite={toggleFavorite}
            onEdit={setEditTarget}
          />
        ))}
      </div>

      <AddWorkoutModal
        key={editTarget?.id ?? 'new'}
        isOpen={addOpen || editTarget !== null}
        workout={editTarget}
        onSave={handleSave}
        onClose={handleClose}
      />
    </>
  )
}
