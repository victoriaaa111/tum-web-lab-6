import { useEffect, useState } from 'react'
import PageLayout from './components/layout/PageLayout'

function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('workout-journal-theme') === 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('workout-journal-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  function handleAddWorkout() {
    // wired in add-workout branch
  }

  return (
    <PageLayout onAddWorkout={handleAddWorkout} onToggleTheme={() => setIsDark(d => !d)} isDark={isDark}>
    </PageLayout>
  )
}

export default App
