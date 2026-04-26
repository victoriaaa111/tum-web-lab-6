import { Heart } from 'lucide-react'
import { MUSCLE_GROUPS } from '../utils/workout'

export default function FilterBar({ activeTags, favoritesOnly, onToggleTag, onToggleFavorites }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-2 bg-surface rounded-2xl p-1">
      <button
        onClick={onToggleFavorites}
        className={`shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
          favoritesOnly ? 'bg-strong text-bg' : 'bg-accent text-strong'
        }`}
      >
        <Heart size={12} strokeWidth={2} className={favoritesOnly ? 'fill-bg' : ''} />
        Favorites
      </button>
      {MUSCLE_GROUPS.map(tag => (
        <button
          key={tag}
          onClick={() => onToggleTag(tag)}
          className={`shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors ${
            activeTags.includes(tag) ? 'bg-strong text-bg' : 'bg-accent text-strong'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
