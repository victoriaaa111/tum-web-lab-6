import { useState } from 'react'
import { Upload } from 'lucide-react'

export default function ImportButton({ onImportData }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-9 h-9 flex items-center justify-center rounded-full text-muted hover:text-strong transition-colors"
        aria-label="Import workouts"
      >
        <Upload size={20} strokeWidth={1.75} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 bg-bg border border-border rounded-2xl p-4 w-72 shadow-lg flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-strong">Expected format</p>
              <p className="text-xs text-muted">A JSON array of workout objects:</p>
            </div>
            <pre className="text-xs text-ink bg-surface rounded-xl p-3 overflow-x-auto leading-relaxed">{`[{
  "title": "Push Day",
  "tags": ["Chest", "Arms"],
  "favorite": false,
  "exercises": [{
    "name": "Bench Press",
    "sets": 4,
    "reps": 10
  }]
}]`}</pre>
            <button
              onClick={() => { onImportData(); setOpen(false) }}
              className="w-full py-2.5 rounded-xl bg-strong text-bg text-sm font-medium"
            >
              Choose file
            </button>
          </div>
        </>
      )}
    </div>
  )
}
