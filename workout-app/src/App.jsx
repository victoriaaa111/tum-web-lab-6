import { useEffect, useRef, useState } from 'react'
import PageLayout from './components/layout/PageLayout'
import Workouts from './components/Workouts'
import AdminDashboard from './components/AdminDashboard'
import LandingPage from './components/LandingPage'
import { useAuth } from './context/useAuth'

function App() {
  const { user, setUser, authChecked, logout } = useAuth()
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('workout-journal-theme') === 'dark'
  })
  const [addOpen, setAddOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('workouts')
  const [activePage, setActivePage] = useState('journal')
  const fileInputRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('workout-journal-theme', isDark ? 'dark' : 'light')
  }, [isDark])

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

  const isAdmin = user.role === 'ADMIN'

  return (
    <PageLayout
      onToggleTheme={toggleTheme}
      isDark={isDark}
      onAddWorkout={() => setAddOpen(true)}
      onImportData={() => fileInputRef.current?.click()}
      onLogout={logout}
      showFab={activeTab === 'workouts' && activePage === 'journal' && user.role !== 'VISITOR'}
      isAdmin={isAdmin}
      activePage={activePage}
      onAdminNav={() => setActivePage(p => p === 'admin' ? 'journal' : 'admin')}
    >
      {activePage === 'admin' && isAdmin ? (
        <AdminDashboard />
      ) : (
        <Workouts
          addOpen={addOpen}
          onCloseAdd={() => setAddOpen(false)}
          fileInputRef={fileInputRef}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </PageLayout>
  )
}

export default App
