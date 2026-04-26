import { useState } from 'react'
import { createWorkout, MUSCLE_GROUPS } from '../utils/workout'
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

export default function Workouts({ addOpen, onCloseAdd, fileInputRef }) {
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
    const now = new Date().toISOString()
    const base = Date.now()
    const merged = incoming
      .filter(w => !existingIds.has(w.id))
      .map((w, i) => ({ ...w, id: `${base}${i}`, createdAt: now }))
    save([...workouts, ...merged])
  }

  function handleFileImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result)
        if (Array.isArray(data)) importWorkouts(data)
      } catch (err) {
        console.error('Invalid JSON file', err)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
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
    .filter(w => {
      if (activeTags.length === 0) return true
      const hasDirectTag = w.tags.some(t => activeTags.includes(t))
      const hasUnknownTag = activeTags.includes('Other') && w.tags.some(t => !MUSCLE_GROUPS.includes(t))
      return hasDirectTag || hasUnknownTag
    })

  function toggleTag(tag) {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  return (
    <>
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileImport} className="hidden" />
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
