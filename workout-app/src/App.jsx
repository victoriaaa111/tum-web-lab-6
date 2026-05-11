import { useEffect, useRef, useState } from 'react'
import PageLayout from './components/layout/PageLayout'
import Workouts from './components/Workouts'
import LandingPage from './components/LandingPage'

function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('workout-journal-theme') === 'dark'
  })
  const [addOpen, setAddOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('workouts')
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('workout-journal-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => { setUser(data); setAuthChecked(true) })
      .catch(() => setAuthChecked(true))
  }, [])

  const toggleTheme = () => setIsDark(d => !d)

  if (!authChecked) return null

  if (!user) {
    return (
      <LandingPage
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onLogin={setUser}
        onSignup={setUser}
      />
    )
  }

  return (
    <PageLayout
      onToggleTheme={toggleTheme}
      isDark={isDark}
      onAddWorkout={() => setAddOpen(true)}
      onImportData={() => fileInputRef.current?.click()}
      showFab={activeTab === 'workouts'}
    >
      <Workouts
        addOpen={addOpen}
        onCloseAdd={() => setAddOpen(false)}
        fileInputRef={fileInputRef}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </PageLayout>
  )
}

export default App
