import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { listUsers, updateUserRole, deleteUser } from '../services/adminApi'
import { useAuth } from '../context/useAuth'

const PAGE_SIZE = 20
const ROLES = ['ADMIN', 'WRITER', 'VISITOR']

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
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

export default function AdminDashboard() {
  const { user: me } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)

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

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-strong mb-5">Users</h2>

      <div className="bg-surface rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1.5fr_auto_auto_auto] gap-x-4 px-5 py-2.5 border-b border-border">
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
                className={`grid grid-cols-[1fr_1.5fr_auto_auto_auto] gap-x-4 items-center px-5 py-3 ${
                  i < users.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <span className="text-sm text-strong truncate">{u.username}</span>
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
