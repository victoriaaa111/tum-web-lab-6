import { useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { createExercise, MUSCLE_GROUPS } from '../utils/workout'

const emptyExercises = () => [createExercise(0)]

export default function AddWorkoutModal({ isOpen, workout = null, onSave, onClose }) {
  const [title, setTitle] = useState(workout?.title ?? '')
  const [tags, setTags] = useState(workout?.tags ?? [])
  const [exercises, setExercises] = useState(
    workout?.exercises?.length ? workout.exercises : emptyExercises()
  )

  function toggleTag(tag) {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  function addExercise() {
    setExercises(prev => [...prev, createExercise(prev.length)])
  }

  function removeExercise(id) {
    setExercises(prev => prev.filter(e => e.id !== id))
  }

  function updateExercise(id, field, value) {
    setExercises(prev =>
      prev.map(e => e.id === id ? { ...e, [field]: value } : e)
    )
  }

  function handleSave() {
    onSave({ title, tags, exercises })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Motion.div
            className="fixed inset-0 z-40 bg-strong/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <Motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg rounded-t-3xl flex flex-col max-h-[90vh] md:max-w-2xl md:mx-auto lg:max-w-3xl xl:max-w-4xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="font-display text-2xl font-semibold text-strong">
                {workout ? 'Edit Workout' : 'New Workout'}
              </h2>
              <button onClick={onClose} className="p-1.5 text-muted hover:text-strong transition-colors">
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-5 pb-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Morning Push Day"
                  className="bg-surface rounded-xl px-4 py-3 text-strong text-sm outline-none placeholder:text-muted w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted">Muscle groups</label>
                <div className="flex flex-wrap gap-2">
                  {MUSCLE_GROUPS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                        tags.includes(tag)
                          ? 'bg-accent text-strong'
                          : 'bg-surface text-muted hover:text-strong'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm text-muted">Exercises</label>

                {exercises.map((exercise, i) => (
                  <div key={exercise.id} className="flex items-end gap-2">
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="text-xs text-muted">Exercise {i + 1}</span>
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={e => updateExercise(exercise.id, 'name', e.target.value)}
                        placeholder="e.g. Bench Press"
                        className="bg-surface rounded-xl px-3 py-2.5 text-strong text-sm outline-none placeholder:text-muted w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-14">
                      <span className="text-xs text-muted">Sets</span>
                      <input
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={e => updateExercise(exercise.id, 'sets', Number(e.target.value))}
                        className="bg-surface rounded-xl px-2 py-2.5 text-strong text-sm outline-none text-center w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-14">
                      <span className="text-xs text-muted">Reps</span>
                      <input
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={e => updateExercise(exercise.id, 'reps', Number(e.target.value))}
                        className="bg-surface rounded-xl px-2 py-2.5 text-strong text-sm outline-none text-center w-full"
                      />
                    </div>
                    <button
                      onClick={() => removeExercise(exercise.id)}
                      disabled={exercises.length === 1}
                      className="p-2.5 mb-0.5 text-muted hover:text-strong transition-colors disabled:opacity-30"
                    >
                      <X size={16} strokeWidth={1.75} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={addExercise}
                  className="flex items-center gap-2 text-sm text-muted hover:text-strong transition-colors self-start"
                >
                  <Plus size={16} strokeWidth={1.75} />
                  Add exercise
                </button>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-5">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-surface text-muted text-sm hover:text-strong transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-strong text-bg text-sm font-medium"
              >
                Save
              </button>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
