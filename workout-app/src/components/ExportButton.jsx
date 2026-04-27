import { useState } from 'react'
import { Download } from 'lucide-react'

const KEY = 'workout-journal-workouts'
const SESSIONS_KEY = 'workout-journal-sessions'

function download(storageKey, filename) {
  const data = localStorage.getItem(storageKey) ?? '[]'
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ExportButton() {
  const [open, setOpen] = useState(false)

  function handleExport(type) {
    if (type === 'workouts') download(KEY, 'workouts.json')
    else download(SESSIONS_KEY, 'history.json')
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-9 h-9 flex items-center justify-center rounded-full text-muted hover:text-strong transition-colors"
        aria-label="Export"
      >
        <Download size={20} strokeWidth={1.75} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 bg-bg border border-border rounded-2xl p-2 shadow-lg flex flex-col gap-1 w-40">
            <button
              onClick={() => handleExport('workouts')}
              className="text-left px-3 py-2 text-sm text-ink hover:text-strong rounded-xl hover:bg-surface transition-colors"
            >
              Workouts
            </button>
            <button
              onClick={() => handleExport('history')}
              className="text-left px-3 py-2 text-sm text-ink hover:text-strong rounded-xl hover:bg-surface transition-colors"
            >
              History
            </button>
          </div>
        </>
      )}
    </div>
  )
}
