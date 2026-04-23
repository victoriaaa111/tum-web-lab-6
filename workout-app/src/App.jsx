import { useEffect, useState } from 'react'
import PageLayout from './components/layout/PageLayout'
import Workouts from './components/Workouts'

function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('workout-journal-theme') === 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('workout-journal-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <PageLayout onToggleTheme={() => setIsDark(d => !d)} isDark={isDark}>
      <Workouts />
    </PageLayout>
  )
}

export default App
