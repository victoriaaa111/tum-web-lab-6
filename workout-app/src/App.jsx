import { useEffect, useRef, useState } from 'react'
import PageLayout from './components/layout/PageLayout'
import Workouts from './components/Workouts'

function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('workout-journal-theme') === 'dark'
  })
  const [addOpen, setAddOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('workouts')
  const fileInputRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('workout-journal-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <PageLayout
      onToggleTheme={() => setIsDark(d => !d)}
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
