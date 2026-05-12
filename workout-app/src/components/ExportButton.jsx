import { useState } from 'react'
import { Download } from 'lucide-react'

async function downloadFromApi(path, filename) {
  const res = await fetch(`/api${path}`, { credentials: 'include' })
  if (!res.ok) throw new Error('Export failed')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ExportButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(null)

  async function handleExport(type) {
    setLoading(type)
    try {
      if (type === 'workouts') await downloadFromApi('/workouts/export', 'workouts.json')
      else await downloadFromApi('/sessions/export', 'history.json')
    } catch (err) {
      console.error('Export failed', err)
    } finally {
      setLoading(null)
      setOpen(false)
    }
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
              disabled={loading !== null}
              className="text-left px-3 py-2 text-sm text-ink hover:text-strong rounded-xl hover:bg-surface transition-colors disabled:opacity-50"
            >
              {loading === 'workouts' ? 'Exporting…' : 'Workouts'}
            </button>
            <button
              onClick={() => handleExport('history')}
              disabled={loading !== null}
              className="text-left px-3 py-2 text-sm text-ink hover:text-strong rounded-xl hover:bg-surface transition-colors disabled:opacity-50"
            >
              {loading === 'history' ? 'Exporting…' : 'History'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
