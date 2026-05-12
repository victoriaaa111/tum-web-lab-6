import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MUSCLE_GROUPS } from '../utils/workout'
import { listWorkouts, createWorkout, updateWorkout, deleteWorkout } from '../services/workoutsApi'
import WorkoutCard from './WorkoutCard'
import AddWorkoutModal from './AddWorkoutModal'
import FilterBar from './FilterBar'
import ActiveSession from './ActiveSession'
import SessionHistory from './SessionHistory'

const SESSIONS_KEY = 'workout-journal-sessions'
const PAGE_SIZE = 10

function loadSessions() {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export default function Workouts({ addOpen, onCloseAdd, fileInputRef, activeTab, onTabChange }) {
  const queryClient = useQueryClient()
  const [sessions, setSessions] = useState(loadSessions)
  const [activeSession, setActiveSession] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [activeTags, setActiveTags] = useState([])
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [historyActiveTags, setHistoryActiveTags] = useState([])
  const [page, setPage] = useState(0)

  const filters = { page, size: PAGE_SIZE, tags: activeTags, ...(favoritesOnly && { favorite: true }) }

  const { data, isLoading } = useQuery({
    queryKey: ['workouts', filters],
    queryFn: () => listWorkouts(filters),
  })

  const workouts = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['workouts'] })
  }

  const createMutation = useMutation({ mutationFn: createWorkout, onSuccess: invalidate })
  const updateMutation = useMutation({ mutationFn: ({ id, data }) => updateWorkout(id, data), onSuccess: invalidate })
  const deleteMutation = useMutation({ mutationFn: deleteWorkout, onSuccess: invalidate })

  function saveSessions(updated) {
    setSessions(updated)
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated))
  }

  function importWorkouts(incoming) {
    incoming.forEach(w => createMutation.mutate({ title: w.title, tags: w.tags ?? [], exercises: w.exercises ?? [] }))
  }

  function importSessions(incoming) {
    const existingIds = new Set(sessions.map(s => s.id))
    const now = new Date().toISOString()
    const base = Date.now()
    const merged = incoming
      .filter(s => !existingIds.has(s.id))
      .map((s, i) => ({ ...s, id: `${base}${i}`, finishedAt: s.finishedAt ?? now }))
    saveSessions([...sessions, ...merged])
  }

  function startSession(workout) {
    const base = Date.now()
    setActiveSession({
      id: String(base),
      workoutTitle: workout.title || 'Untitled',
      tags: workout.tags ?? [],
      startedAt: new Date().toISOString(),
      exercises: workout.exercises.map((e, i) => ({ ...e, id: `${base}_${i}`, completed: false })),
    })
  }

  function finishSession(completed) {
    saveSessions([completed, ...sessions])
    setActiveSession(null)
    onTabChange('history')
  }

  function handleSave(formData) {
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, data: formData })
      setEditTarget(null)
    } else {
      createMutation.mutate(formData)
      onCloseAdd()
    }
  }

  function handleClose() {
    setEditTarget(null)
    onCloseAdd()
  }

  const filteredSessions = sessions.filter(s => {
    if (historyActiveTags.length === 0) return true
    const hasDirectTag = s.tags?.some(t => historyActiveTags.includes(t))
    const hasUnknownTag = historyActiveTags.includes('Other') && s.tags?.some(t => !MUSCLE_GROUPS.includes(t))
    return hasDirectTag || hasUnknownTag
  })

  function toggleTag(tag) {
    setPage(0)
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  function toggleHistoryTag(tag) {
    setHistoryActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={e => {
          const file = e.target.files[0]
          if (!file) return
          const reader = new FileReader()
          reader.onload = evt => {
            try {
              const parsed = JSON.parse(evt.target.result)
              if (!Array.isArray(parsed) || parsed.length === 0) return
              if (parsed[0].finishedAt !== undefined) importSessions(parsed)
              else importWorkouts(parsed)
            } catch (err) {
              console.error('Invalid JSON file', err)
            }
          }
          reader.readAsText(file)
          e.target.value = ''
        }}
        className="hidden"
      />

      <div className="flex gap-1 bg-surface rounded-2xl p-1 mb-4">
        <button
          onClick={() => onTabChange('workouts')}
          className={`flex-1 py-1.5 text-sm rounded-xl transition-colors ${
            activeTab === 'workouts' ? 'bg-bg text-strong' : 'text-muted'
          }`}
        >
          Workouts
        </button>
        <button
          onClick={() => onTabChange('history')}
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
            onToggleFavorites={() => { setPage(0); setFavoritesOnly(f => !f) }}
          />

          {isLoading ? (
            <p className="text-sm text-muted text-center py-8">Loading…</p>
          ) : (
            <div className="flex flex-col gap-4">
              {workouts.map(workout => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onRemove={id => deleteMutation.mutate(id)}
                  onToggleFavorite={id => {
                    const w = workouts.find(x => x.id === id)
                    if (w) updateMutation.mutate({ id, data: { favorite: !w.favorite } })
                  }}
                  onEdit={setEditTarget}
                  onStart={startSession}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                className="p-1.5 text-muted hover:text-strong transition-colors disabled:opacity-30"
              >
                <ChevronLeft size={18} strokeWidth={1.75} />
              </button>
              <span className="text-sm text-muted">{page + 1} / {totalPages}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                className="p-1.5 text-muted hover:text-strong transition-colors disabled:opacity-30"
              >
                <ChevronRight size={18} strokeWidth={1.75} />
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <FilterBar
            activeTags={historyActiveTags}
            favoritesOnly={false}
            onToggleTag={toggleHistoryTag}
            onToggleFavorites={() => {}}
            showFavorites={false}
          />
          <SessionHistory sessions={filteredSessions} onRemove={id => saveSessions(sessions.filter(s => s.id !== id))} />
        </>
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
