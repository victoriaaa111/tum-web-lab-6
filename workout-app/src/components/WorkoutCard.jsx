import { Heart, Pencil, Play, Trash2 } from 'lucide-react'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function WorkoutCard({ workout, onRemove, onToggleFavorite, onEdit, onStart }) {
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
            onClick={() => onEdit(workout)}
            className="p-1.5 rounded-full text-muted hover:text-strong transition-colors"
          >
            <Pencil size={18} strokeWidth={1.75} />
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

      {workout.exercises.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-1">
          {workout.exercises.map(e => (
            <div key={e.id} className="flex items-center justify-between">
              <span className="text-sm text-ink">{e.name || 'Unnamed'}</span>
              <span className="text-xs text-muted">{e.sets} × {e.reps}</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => onStart(workout)}
        className="flex items-center gap-1.5 text-xs text-muted hover:text-strong transition-colors self-start pt-1"
      >
        <Play size={13} strokeWidth={1.75} />
        Start workout
      </button>
    </div>
  )
}
