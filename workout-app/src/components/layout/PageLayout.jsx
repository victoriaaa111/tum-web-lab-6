import { Plus } from 'lucide-react'

function PageLayout({ onAddWorkout, children }) {
  return (
    <div className="min-h-screen textured flex justify-center items-start py-6 px-4 md:py-10 md:px-8">
      <div className="
        w-full bg-bg flex flex-col relative
        rounded-3xl shadow-xl overflow-hidden
        min-h-[calc(100vh-3rem)]
        md:max-w-2xl md:min-h-[calc(100vh-5rem)]
        lg:max-w-3xl
        xl:max-w-4xl
      ">

        <header className="flex items-center justify-between px-6 pt-10 pb-4 lg:px-10 lg:pt-12">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-strong lg:text-4xl">
            Workout Journal
          </h1>
        </header>

        <main className="flex-1 px-6 pb-28 lg:px-10">
          {children}
        </main>

        <button
          onClick={onAddWorkout}
          className="absolute bottom-8 right-6 w-14 h-14 rounded-full bg-strong text-bg flex items-center justify-center shadow-lg active:scale-95 transition-transform lg:right-10 lg:bottom-10 lg:w-16 lg:h-16"
        >
          <Plus size={24} strokeWidth={2} />
        </button>

      </div>
    </div>
  )
}

export default PageLayout
