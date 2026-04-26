import { useState } from 'react'
import { Heart } from 'lucide-react'
import { createWorkout, MUSCLE_GROUPS } from '../utils/workout'
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
  const [editTarget, setEditTarget] = useState(null)
  const [activeTag, setActiveTag] = useState(null)
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
    .filter(w => !activeTag || w.tags.includes(activeTag))

  return (
    <>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-6 px-6 mb-2">
        <button
          onClick={() => setFavoritesOnly(f => !f)}
          className={`shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
            favoritesOnly ? 'bg-strong text-bg' : 'bg-surface text-muted hover:text-strong'
          }`}
        >
          <Heart size={12} strokeWidth={2} className={favoritesOnly ? 'fill-bg' : ''} />
          Favorites
        </button>
        {MUSCLE_GROUPS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(t => t === tag ? null : tag)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors ${
              activeTag === tag ? 'bg-strong text-bg' : 'bg-surface text-muted hover:text-strong'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

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
