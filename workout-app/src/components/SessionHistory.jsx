import { Trash2 } from 'lucide-react'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(startedAt, finishedAt) {
  const totalMinutes = Math.floor((new Date(finishedAt) - new Date(startedAt)) / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${totalMinutes < 1 ? '<1' : totalMinutes}m`
}

export default function SessionHistory({ sessions, onRemove }) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <p className="font-display text-2xl text-strong">No sessions yet</p>
        <p className="text-sm text-muted">Start a workout to begin tracking</p>
      </div>
    )
  }

  const sorted = [...sessions].sort((a, b) => new Date(b.finishedAt) - new Date(a.finishedAt))

  return (
    <div className="flex flex-col gap-4">
      {sorted.map(session => (
        <div key={session.id} className="bg-surface rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-xl font-semibold text-strong leading-tight">
                {session.workoutTitle || 'Untitled'}
              </h3>
              <p className="text-xs text-muted mt-0.5">
                {formatDate(session.finishedAt)} · {formatTime(session.startedAt)} – {formatTime(session.finishedAt)} · {formatDuration(session.startedAt, session.finishedAt)}
              </p>
            </div>
            <button
              onClick={() => onRemove(session.id)}
              className="p-1.5 rounded-full text-muted hover:text-strong transition-colors shrink-0"
            >
              <Trash2 size={18} strokeWidth={1.75} />
            </button>
          </div>

          {session.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {session.tags.map(tag => (
                <span key={tag} className="bg-accent text-strong text-xs px-2.5 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            {session.exercises.map(e => (
              <div
                key={e.id}
                className={`flex items-center justify-between ${e.completed ? '' : 'opacity-40'}`}
              >
                <span className={`text-sm ${e.completed ? 'text-ink' : 'text-muted line-through'}`}>
                  {e.name || 'Unnamed'}
                </span>
                <span className="text-xs text-muted">{e.sets} × {e.reps}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
