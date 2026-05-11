import { useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { X } from 'lucide-react'
import { login } from '../services/authApi'

export default function LoginPage({ isOpen, onClose, onSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      onSuccess(user)
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setEmail('')
    setPassword('')
    setError('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Motion.div
            className="fixed inset-0 z-40 bg-strong/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <Motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg rounded-t-3xl flex flex-col max-h-[90vh] md:max-w-2xl md:mx-auto lg:max-w-3xl xl:max-w-4xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="font-display text-2xl font-semibold text-strong">Log in</h2>
              <button onClick={handleClose} className="p-1.5 text-muted hover:text-strong transition-colors">
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 flex flex-col gap-4 pb-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="bg-surface rounded-xl px-4 py-3 text-strong text-sm outline-none placeholder:text-muted w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="bg-surface rounded-xl px-4 py-3 text-strong text-sm outline-none placeholder:text-muted w-full"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </form>

            <div className="flex flex-col gap-3 px-6 py-5">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-strong text-bg text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Logging in…' : 'Log in'}
              </button>
              <p className="text-sm text-muted text-center">
                Don't have an account?{' '}
                <button
                  onClick={() => { handleClose(); onSwitchToSignup() }}
                  className="text-strong underline-offset-2 hover:underline transition-all"
                >
                  Sign up
                </button>
              </p>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
