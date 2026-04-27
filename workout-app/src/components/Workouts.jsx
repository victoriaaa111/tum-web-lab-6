import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { createWorkout, MUSCLE_GROUPS } from '../utils/workout'
import WorkoutCard from './WorkoutCard'
import AddWorkoutModal from './AddWorkoutModal'
import FilterBar from './FilterBar'
import ActiveSession from './ActiveSession'
import SessionHistory from './SessionHistory'

const KEY = 'workout-journal-workouts'
const SESSIONS_KEY = 'workout-journal-sessions'

function load() {
  try {
    const stored = localStorage.getItem(KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function loadSessions() {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export default function Workouts({ addOpen, onCloseAdd, fileInputRef }) {
  const [workouts, setWorkouts] = useState(load)
  const [sessions, setSessions] = useState(loadSessions)
  const [activeSession, setActiveSession] = useState(null)
  const [activeTab, setActiveTab] = useState('workouts')
  const [editTarget, setEditTarget] = useState(null)
  const [activeTags, setActiveTags] = useState([])
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  function save(updated) {
    setWorkouts(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  function saveSessions(updated) {
    setSessions(updated)
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated))
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

  function startSession(workout) {
    const base = Date.now()
    setActiveSession({
      id: String(base),
      workoutTitle: workout.title || 'Untitled',
      startedAt: new Date().toISOString(),
      exercises: workout.exercises.map((e, i) => ({ ...e, id: `${base}_${i}`, completed: false })),
    })
  }

  function finishSession(completed) {
    saveSessions([completed, ...sessions])
    setActiveSession(null)
    setActiveTab('history')
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
      <input ref={fileInputRef} type="file" accept=".json" onChange={e => {
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
      }} className="hidden" />

      <div className="flex gap-1 bg-surface rounded-2xl p-1 mb-4">
        <button
          onClick={() => setActiveTab('workouts')}
          className={`flex-1 py-1.5 text-sm rounded-xl transition-colors ${
            activeTab === 'workouts' ? 'bg-bg text-strong' : 'text-muted'
          }`}
        >
          Workouts
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-1.5 text-sm rounded-xl transition-colors ${
            activeTab === 'history' ? 'bg-bg text-strong' : 'text-muted'
          }`}
        >
          History
        </button>
      </div>

      {activeTab === 'workouts' ? (
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
                onStart={startSession}
              />
            ))}
          </div>
        </>
      ) : (
        <SessionHistory sessions={sessions} />
      )}

      <AddWorkoutModal
        key={editTarget?.id ?? 'new'}
        isOpen={addOpen || editTarget !== null}
        workout={editTarget}
        onSave={handleSave}
        onClose={handleClose}
      />

      <AnimatePresence>
        {activeSession && (
          <ActiveSession
            session={activeSession}
            onFinish={finishSession}
            onClose={() => setActiveSession(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
