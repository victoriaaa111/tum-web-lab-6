import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { listUsers, updateUserRole, deleteUser, getUserWorkouts, getUserSessions } from '../services/adminApi'
import { useAuth } from '../context/useAuth'

const PAGE_SIZE = 20
const ROLES = ['ADMIN', 'WRITER', 'VISITOR']

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatDuration(startedAt, finishedAt) {
  const totalMinutes = Math.floor((new Date(finishedAt) - new Date(startedAt)) / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${totalMinutes < 1 ? '<1' : totalMinutes}m`
}

function RoleSelect({ value, disabled, onChange }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)

  function handleOpen() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.left })
    }
    setOpen(o => !o)
  }

  return (
    <div>
      <button
        ref={btnRef}
        onClick={handleOpen}
        disabled={disabled}
        className="text-xs bg-bg border border-border rounded-lg px-2.5 py-1.5 text-strong flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-default hover:border-muted transition-colors"
      >
        {value}
        <ChevronDown size={11} strokeWidth={2} className="text-muted" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed z-50 bg-bg border border-border rounded-xl p-1 shadow-lg flex flex-col min-w-[100px]"
            style={{ top: pos.top, left: pos.left }}
          >
            {ROLES.map(r => (
              <button
                key={r}
                onClick={() => { onChange(r); setOpen(false) }}
                className={`text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  r === value ? 'text-strong bg-surface' : 'text-muted hover:text-strong hover:bg-surface'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 animate-pulse">
      <div className="h-4 w-1/4 bg-muted/20 rounded-lg" />
      <div className="h-4 w-1/3 bg-muted/20 rounded-lg" />
      <div className="h-7 w-20 bg-muted/20 rounded-lg ml-auto" />
      <div className="h-4 w-20 bg-muted/20 rounded-lg" />
      <div className="h-7 w-7 bg-muted/20 rounded-lg" />
    </div>
  )
}

function PaginationBar({ page, totalPages, onPrev, onNext }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center gap-3 mt-3">
      <button
        onClick={onPrev}
        disabled={page === 0}
        className="p-1.5 text-muted hover:text-strong transition-colors disabled:opacity-30"
      >
        <ChevronLeft size={16} strokeWidth={1.75} />
      </button>
      <span className="text-xs text-muted">{page + 1} / {totalPages}</span>
      <button
        onClick={onNext}
        disabled={page >= totalPages - 1}
        className="p-1.5 text-muted hover:text-strong transition-colors disabled:opacity-30"
      >
        <ChevronRight size={16} strokeWidth={1.75} />
      </button>
    </div>
  )
}

function UserDetail({ user, onBack }) {
  const [wPage, setWPage] = useState(0)
  const [sPage, setSPage] = useState(0)

  const { data: wData, isLoading: wLoading } = useQuery({
    queryKey: ['admin', 'user-workouts', user.id, wPage],
    queryFn: () => getUserWorkouts(user.id, { page: wPage, size: 5 }),
  })

  const { data: sData, isLoading: sLoading } = useQuery({
    queryKey: ['admin', 'user-sessions', user.id, sPage],
    queryFn: () => getUserSessions(user.id, { page: sPage, size: 5 }),
  })

  const workouts = wData?.data ?? []
  const sessions = sData?.data ?? []

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted hover:text-strong transition-colors mb-5"
      >
        <ChevronLeft size={15} strokeWidth={1.75} />
        Back to users
      </button>

      <div className="mb-6">
        <h3 className="font-display text-xl font-semibold text-strong">{user.username}</h3>
        <p className="text-sm text-muted">{user.email} · <span className="uppercase text-xs tracking-wide">{user.role}</span> · Joined {formatDate(user.createdAt)}</p>
      </div>

      <section className="mb-8">
        <h4 className="text-sm font-medium text-strong mb-3">Workouts</h4>
        {wLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-surface rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : workouts.length === 0 ? (
          <p className="text-sm text-muted">No workouts.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {workouts.map(w => (
              <div key={w.id} className="bg-surface rounded-2xl p-4 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-strong truncate">{w.title || 'Untitled'}</p>
                  <p className="text-xs text-muted shrink-0">{formatDate(w.createdAt)}</p>
                </div>
                {w.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {w.tags.map(t => (
                      <span key={t} className="bg-accent text-strong text-xs px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted">{w.exercises?.length ?? 0} exercises</p>
              </div>
            ))}
          </div>
        )}
        <PaginationBar
          page={wPage}
          totalPages={wData?.totalPages ?? 1}
          onPrev={() => setWPage(p => p - 1)}
          onNext={() => setWPage(p => p + 1)}
        />
      </section>

      <section>
        <h4 className="text-sm font-medium text-strong mb-3">Sessions</h4>
        {sLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 bg-surface rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-muted">No sessions.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sessions.map(s => (
              <div key={s.id} className="bg-surface rounded-2xl p-4 flex items-center justify-between gap-2">
                <p className="text-sm text-strong truncate">{s.workoutTitle || 'Untitled'}</p>
                <p className="text-xs text-muted shrink-0">{formatDate(s.finishedAt)} · {formatDuration(s.startedAt, s.finishedAt)}</p>
              </div>
            ))}
          </div>
        )}
        <PaginationBar
          page={sPage}
          totalPages={sData?.totalPages ?? 1}
          onPrev={() => setSPage(p => p - 1)}
          onNext={() => setSPage(p => p + 1)}
        />
      </section>
    </div>
  )
}

export default function AdminDashboard() {
  const { user: me } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'users', page],
    queryFn: () => listUsers({ page, size: PAGE_SIZE }),
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })

  const users = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  if (selectedUser) {
    return <UserDetail user={selectedUser} onBack={() => setSelectedUser(null)} />
  }

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-strong mb-5">Users</h2>

      {/* Desktop table */}
      <div className="hidden md:block bg-surface rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1.5fr_90px_90px_32px] gap-x-4 px-5 py-2.5 border-b border-border">
          <span className="text-xs text-muted uppercase tracking-wide">Username</span>
          <span className="text-xs text-muted uppercase tracking-wide">Email</span>
          <span className="text-xs text-muted uppercase tracking-wide">Role</span>
          <span className="text-xs text-muted uppercase tracking-wide">Joined</span>
          <span />
        </div>

        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <p className="text-sm text-muted">Could not load users.</p>
            <button
              onClick={refetch}
              className="text-xs text-strong underline-offset-2 hover:underline transition-all"
            >
              Try again
            </button>
          </div>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted text-center py-12">No users found.</p>
        ) : (
          users.map((u, i) => {
            const isSelf = u.id === me?.id
            const roleUpdating = roleMutation.isPending && roleMutation.variables?.id === u.id
            const deleting = deleteMutation.isPending && deleteMutation.variables === u.id
            return (
              <div
                key={u.id}
                className={`grid grid-cols-[1fr_1.5fr_90px_90px_32px] gap-x-4 items-center px-5 py-3 ${
                  i < users.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <button
                  onClick={() => setSelectedUser(u)}
                  className="text-sm text-strong truncate text-left hover:underline underline-offset-2"
                >
                  {u.username}
                </button>
                <span className="text-sm text-muted truncate">{u.email}</span>
                <RoleSelect
                  value={u.role}
                  disabled={isSelf || roleUpdating}
                  onChange={role => roleMutation.mutate({ id: u.id, role })}
                />
                <span className="text-xs text-muted whitespace-nowrap">{formatDate(u.createdAt)}</span>
                <button
                  onClick={() => deleteMutation.mutate(u.id)}
                  disabled={isSelf || deleting}
                  className="p-1.5 text-muted hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label={`Delete ${u.username}`}
                >
                  <Trash2 size={15} strokeWidth={1.75} />
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-2xl p-4 flex flex-col gap-3 animate-pulse">
              <div className="h-4 w-1/3 bg-muted/20 rounded-lg" />
              <div className="h-3 w-1/2 bg-muted/20 rounded-lg" />
              <div className="h-7 w-24 bg-muted/20 rounded-lg" />
            </div>
          ))
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <p className="text-sm text-muted">Could not load users.</p>
            <button onClick={refetch} className="text-xs text-strong underline-offset-2 hover:underline">
              Try again
            </button>
          </div>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted text-center py-12">No users found.</p>
        ) : (
          users.map(u => {
            const isSelf = u.id === me?.id
            const roleUpdating = roleMutation.isPending && roleMutation.variables?.id === u.id
            const deleting = deleteMutation.isPending && deleteMutation.variables === u.id
            return (
              <div key={u.id} className="bg-surface rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => setSelectedUser(u)}
                    className="text-left flex flex-col gap-0.5"
                  >
                    <span className="text-sm text-strong font-medium hover:underline underline-offset-2">{u.username}</span>
                    <span className="text-xs text-muted">{u.email}</span>
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(u.id)}
                    disabled={isSelf || deleting}
                    className="p-1.5 text-muted hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                    aria-label={`Delete ${u.username}`}
                  >
                    <Trash2 size={15} strokeWidth={1.75} />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted">{formatDate(u.createdAt)}</span>
                  <RoleSelect
                    value={u.role}
                    disabled={isSelf || roleUpdating}
                    onChange={role => roleMutation.mutate({ id: u.id, role })}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 0}
            className="p-1.5 text-muted hover:text-strong transition-colors disabled:opacity-30"
          >
            <ChevronLeft size={18} strokeWidth={1.75} />
          </button>
          <span className="text-sm text-muted">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages - 1}
            className="p-1.5 text-muted hover:text-strong transition-colors disabled:opacity-30"
          >
            <ChevronRight size={18} strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  )
}
