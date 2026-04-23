import { Heart, Trash2 } from 'lucide-react'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function WorkoutCard({ workout, onRemove, onToggleFavorite }) {
  const totalSets = workout.exercises.reduce((sum, e) => sum + e.sets, 0)
  const summary = `${workout.exercises.length} exercise${workout.exercises.length !== 1 ? 's' : ''} · ${totalSets} sets`

  return (
    <div className="bg-surface rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-display text-xl font-semibold text-strong leading-tight">
          {workout.title || 'Untitled'}
        </h2>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggleFavorite(workout.id)}
            className="p-1.5 rounded-full text-muted hover:text-strong transition-colors"
          >
            <Heart
              size={18}
              strokeWidth={1.75}
              className={workout.favorite ? 'fill-accent text-accent' : ''}
            />
          </button>
          <button
            onClick={() => onRemove(workout.id)}
            className="p-1.5 rounded-full text-muted hover:text-strong transition-colors"
          >
            <Trash2 size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <p className="text-xs text-muted">{formatDate(workout.createdAt)}</p>

      {workout.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {workout.tags.map(tag => (
            <span key={tag} className="bg-accent text-strong text-xs px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-muted">{summary}</p>
    </div>
  )
}
