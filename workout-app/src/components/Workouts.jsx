import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MUSCLE_GROUPS } from '../utils/workout'
import { listWorkouts, createWorkout, updateWorkout, deleteWorkout } from '../services/workoutsApi'
import { listSessions, createSession, deleteSession } from '../services/sessionsApi'
import WorkoutCard from './WorkoutCard'
import AddWorkoutModal from './AddWorkoutModal'
import FilterBar from './FilterBar'
import ActiveSession from './ActiveSession'
import SessionHistory from './SessionHistory'

const PAGE_SIZE = 10

export default function Workouts({ addOpen, onCloseAdd, fileInputRef, activeTab, onTabChange }) {
  const queryClient = useQueryClient()
  const [activeSession, setActiveSession] = useState(null)
  const [editTarget, setEditTarget] = useState(null)

  // workout filters
  const [activeTags, setActiveTags] = useState([])
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [page, setPage] = useState(0)

  // session filters
  const [historyActiveTags, setHistoryActiveTags] = useState([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sessionPage, setSessionPage] = useState(0)

  const workoutFilters = { page, size: PAGE_SIZE, tags: activeTags, ...(favoritesOnly && { favorite: true }) }
  const sessionFilters = {
    page: sessionPage,
    size: PAGE_SIZE,
    tags: historyActiveTags,
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  }

  const { data: workoutsData, isLoading: workoutsLoading } = useQuery({
    queryKey: ['workouts', workoutFilters],
    queryFn: () => listWorkouts(workoutFilters),
    enabled: activeTab === 'workouts',
  })

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions', sessionFilters],
    queryFn: () => listSessions(sessionFilters),
    enabled: activeTab === 'history',
  })

  const workouts = workoutsData?.data ?? []
  const totalPages = workoutsData?.totalPages ?? 1
  const sessions = sessionsData?.data ?? []
  const sessionTotalPages = sessionsData?.totalPages ?? 1

  const createWorkoutMutation = useMutation({
    mutationFn: createWorkout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workouts'] }),
  })
  const updateWorkoutMutation = useMutation({
    mutationFn: ({ id, data }) => updateWorkout(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workouts'] }),
  })
  const deleteWorkoutMutation = useMutation({
    mutationFn: deleteWorkout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workouts'] }),
  })
  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  })
  const deleteSessionMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  })

  function importWorkouts(incoming) {
    incoming.forEach(w => createWorkoutMutation.mutate({ title: w.title, tags: w.tags ?? [], exercises: w.exercises ?? [] }))
  }

  function importSessions(incoming) {
    const now = new Date().toISOString()
    incoming.forEach(s => {
      createSessionMutation.mutate({ ...s, finishedAt: s.finishedAt ?? now })
    })
  }

  function startSession(workout) {
    const base = Date.now()
    setActiveSession({
      workoutTitle: workout.title || 'Untitled',
      workoutId: workout.id,
      tags: workout.tags ?? [],
      startedAt: new Date().toISOString(),
      exercises: workout.exercises.map((e, i) => ({ ...e, id: `${base}_${i}`, completed: false })),
    })
  }

  function finishSession(completed) {
    createSessionMutation.mutate(completed)
    setActiveSession(null)
    onTabChange('history')
  }

  function handleSave(formData) {
    if (editTarget) {
      updateWorkoutMutation.mutate({ id: editTarget.id, data: formData })
      setEditTarget(null)
    } else {
      createWorkoutMutation.mutate(formData)
      onCloseAdd()
    }
  }

  function handleClose() {
    setEditTarget(null)
    onCloseAdd()
  }

  function toggleTag(tag) {
    setPage(0)
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  function toggleHistoryTag(tag) {
    setSessionPage(0)
    setHistoryActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  // client-side tag filter for sessions not covered by date range (tags are server-filtered)
  const filteredSessions = sessions.filter(s => {
    if (historyActiveTags.length === 0) return true
    const hasDirectTag = s.tags?.some(t => historyActiveTags.includes(t))
    const hasUnknownTag = historyActiveTags.includes('Other') && s.tags?.some(t => !MUSCLE_GROUPS.includes(t))
    return hasDirectTag || hasUnknownTag
  })

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

          {workoutsLoading ? (
            <p className="text-sm text-muted text-center py-8">Loading…</p>
          ) : (
            <div className="flex flex-col gap-4">
              {workouts.map(workout => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onRemove={id => deleteWorkoutMutation.mutate(id)}
                  onToggleFavorite={id => {
                    const w = workouts.find(x => x.id === id)
                    if (w) updateWorkoutMutation.mutate({ id, data: { favorite: !w.favorite } })
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

          <div className="flex gap-2 mb-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-muted">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => { setDateFrom(e.target.value); setSessionPage(0) }}
                className="bg-surface rounded-xl px-3 py-2 text-strong text-sm outline-none w-full"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-muted">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => { setDateTo(e.target.value); setSessionPage(0) }}
                className="bg-surface rounded-xl px-3 py-2 text-strong text-sm outline-none w-full"
              />
            </div>
          </div>

          {sessionsLoading ? (
            <p className="text-sm text-muted text-center py-8">Loading…</p>
          ) : (
            <SessionHistory
              sessions={filteredSessions}
              onRemove={id => deleteSessionMutation.mutate(id)}
            />
          )}

          {sessionTotalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setSessionPage(p => p - 1)}
                disabled={sessionPage === 0}
                className="p-1.5 text-muted hover:text-strong transition-colors disabled:opacity-30"
              >
                <ChevronLeft size={18} strokeWidth={1.75} />
              </button>
              <span className="text-sm text-muted">{sessionPage + 1} / {sessionTotalPages}</span>
              <button
                onClick={() => setSessionPage(p => p + 1)}
                disabled={sessionPage >= sessionTotalPages - 1}
                className="p-1.5 text-muted hover:text-strong transition-colors disabled:opacity-30"
              >
                <ChevronRight size={18} strokeWidth={1.75} />
              </button>
            </div>
          )}
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
