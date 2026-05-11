import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Activity, Dumbbell, ListChecks, Moon, Sun } from 'lucide-react'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'

const FEATURES = [
  {
    icon: Dumbbell,
    title: 'Build your library',
    description: 'Create reusable workout templates with exercises, sets and reps.',
  },
  {
    icon: ListChecks,
    title: 'Track live sessions',
    description: 'Follow along and check off exercises as you go.',
  },
  {
    icon: Activity,
    title: 'Review your history',
    description: 'Browse past sessions filtered by muscle group or favorites.',
  },
]

export default function LandingPage({ onLogin, onSignup, onToggleTheme, isDark }) {
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)

  return (
    <div className="min-h-screen textured flex justify-center items-start py-6 px-4 md:py-10 md:px-8 transition-colors duration-300">
      <div className="
        w-full bg-bg flex flex-col
        rounded-3xl shadow-xl overflow-hidden
        min-h-[calc(100vh-3rem)]
        md:max-w-2xl md:min-h-[calc(100vh-5rem)]
        lg:max-w-3xl xl:max-w-4xl
        transition-colors duration-300
      ">

        <header className="flex items-center justify-between px-6 pt-10 pb-4 lg:px-10 lg:pt-12">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-strong lg:text-4xl">
            Workout Journal
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLoginOpen(true)}
              className="text-sm text-muted hover:text-strong transition-colors px-3 py-1.5"
            >
              Log in
            </button>
            <button
              onClick={() => setSignupOpen(true)}
              className="text-sm px-4 py-1.5 rounded-xl bg-strong text-bg font-medium active:scale-95 transition-transform"
            >
              Sign up
            </button>
            <button
              onClick={onToggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full text-muted hover:text-strong transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} strokeWidth={1.75} /> : <Moon size={20} strokeWidth={1.75} />}
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 pb-16 lg:px-10 flex flex-col gap-14">

          <Motion.section
            className="flex flex-col gap-6 pt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="bg-accent text-strong text-xs font-medium px-3 py-1 rounded-full self-start">
              Your personal training log
            </span>
            <h2 className="font-display text-4xl font-semibold text-strong leading-tight lg:text-5xl">
              Train with intention.<br />Log every rep.
            </h2>
            <p className="text-muted text-base leading-relaxed max-w-md">
              Plan workouts, track live sessions and build a history of every set you've ever done - all in one place.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSignupOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-strong text-bg text-sm font-medium active:scale-95 transition-transform"
              >
                Get started
              </button>
              <button
                onClick={() => setLoginOpen(true)}
                className="px-6 py-2.5 rounded-xl border border-border text-strong text-sm font-medium active:scale-95 transition-transform"
              >
                Log in
              </button>
            </div>
          </Motion.section>

          <section className="flex flex-col gap-4">
            <Motion.h3
              className="font-display text-xl font-semibold text-strong"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Everything you need
            </Motion.h3>
            <div className="flex flex-col gap-3">
              {FEATURES.map((feature, i) => (
                <Motion.div
                  key={feature.title}
                  className="bg-surface rounded-2xl p-5 flex gap-4 items-start"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.4 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <feature.icon size={18} strokeWidth={1.75} className="text-strong" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-strong">{feature.title}</span>
                    <span className="text-sm text-muted leading-relaxed">{feature.description}</span>
                  </div>
                </Motion.div>
              ))}
            </div>
          </section>

        </main>
      </div>

      <LoginPage
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={onLogin}
        onSwitchToSignup={() => setSignupOpen(true)}
      />
      <SignupPage
        isOpen={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSuccess={onSignup}
        onSwitchToLogin={() => setLoginOpen(true)}
      />
    </div>
  )
}
