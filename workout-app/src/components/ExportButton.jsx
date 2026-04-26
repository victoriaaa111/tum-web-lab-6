import { Download } from 'lucide-react'

const KEY = 'workout-journal-workouts'

export default function ExportButton() {
  function handleExport() {
    const data = localStorage.getItem(KEY) ?? '[]'
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'workouts.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="w-9 h-9 flex items-center justify-center rounded-full text-muted hover:text-strong transition-colors"
      aria-label="Export workouts"
    >
      <Download size={20} strokeWidth={1.75} />
    </button>
  )
}
