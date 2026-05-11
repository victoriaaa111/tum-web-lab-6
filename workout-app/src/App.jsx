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
  const [showLanding, setShowLanding] = useState(true)
  const fileInputRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('workout-journal-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(d => !d)

  if (showLanding) {
    return (
      <LandingPage
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onLogin={() => setShowLanding(false)}
        onSignup={() => setShowLanding(false)}
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
