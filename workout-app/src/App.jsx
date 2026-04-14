import PageLayout from './components/layout/PageLayout'

function App() {
  function handleAddWorkout() {
    // wired in add-workout branch
  }

  return (
    <PageLayout onAddWorkout={handleAddWorkout}>
    </PageLayout>
  )
}

export default App
