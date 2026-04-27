function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function SessionHistory({ sessions }) {
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
          <div>
            <h3 className="font-display text-xl font-semibold text-strong leading-tight">
              {session.workoutTitle || 'Untitled'}
            </h3>
            <p className="text-xs text-muted mt-0.5">
              {formatDate(session.finishedAt)} at {formatTime(session.finishedAt)}
            </p>
          </div>
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
