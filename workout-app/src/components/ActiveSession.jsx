import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

export default function ActiveSession({ session, onFinish, onClose }) {
  const [exercises, setExercises] = useState(
    () => session.exercises.map(e => ({ ...e, completed: false }))
  )

  function toggleExercise(id) {
    setExercises(prev =>
      prev.map(e => e.id === id ? { ...e, completed: !e.completed } : e)
    )
  }

  function handleFinish() {
    onFinish({ ...session, finishedAt: new Date().toISOString(), exercises })
  }

  const completedCount = exercises.filter(e => e.completed).length

  return (
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
        <div className="flex items-center justify-between px-6 pt-6 pb-1">
          <div>
            <h2 className="font-display text-2xl font-semibold text-strong">
              {session.workoutTitle || 'Untitled'}
            </h2>
            <p className="text-xs text-muted mt-0.5">{completedCount} / {exercises.length} done</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-strong transition-colors">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
          {exercises.map(e => (
            <button
              key={e.id}
              onClick={() => toggleExercise(e.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-colors text-left ${
                e.completed ? 'bg-accent' : 'bg-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  e.completed ? 'bg-strong border-strong' : 'border-muted'
                }`}>
                  {e.completed && <Check size={11} strokeWidth={2.5} className="text-bg" />}
                </div>
                <span className={`text-sm font-medium ${e.completed ? 'line-through text-muted' : 'text-strong'}`}>
                  {e.name || 'Unnamed'}
                </span>
              </div>
              <span className="text-xs text-muted shrink-0">{e.sets} × {e.reps}</span>
            </button>
          ))}
        </div>

        <div className="px-6 py-5">
          <button
            onClick={handleFinish}
            className="w-full py-3 rounded-xl bg-strong text-bg text-sm font-medium"
          >
            Finish Workout
          </button>
        </div>
      </Motion.div>
    </>
  )
}
