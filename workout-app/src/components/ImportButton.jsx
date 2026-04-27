import { useState } from 'react'
import { Upload } from 'lucide-react'

export default function ImportButton({ onImportData }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-9 h-9 flex items-center justify-center rounded-full text-muted hover:text-strong transition-colors"
        aria-label="Import"
      >
        <Upload size={20} strokeWidth={1.75} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 bg-bg border border-border rounded-2xl p-4 w-80 shadow-lg flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-strong">Workouts</p>
              <pre className="text-xs text-ink bg-surface rounded-xl p-3 overflow-x-auto leading-relaxed">{`[{
  "title": "Push Day",
  "tags": ["Chest"],
  "favorite": false,
  "exercises": [{
    "name": "Bench Press",
    "sets": 4,
    "reps": 10
  }]
}]`}</pre>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-strong">History</p>
              <pre className="text-xs text-ink bg-surface rounded-xl p-3 overflow-x-auto leading-relaxed">{`[{
  "workoutTitle": "Push Day",
  "tags": ["Chest"],
  "startedAt": "2025-01-10T09:00:00Z",
  "finishedAt": "2025-01-10T09:45:00Z",
  "exercises": [{
    "name": "Bench Press",
    "sets": 4,
    "reps": 10,
    "completed": true
  }]
}]`}</pre>
            </div>
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
