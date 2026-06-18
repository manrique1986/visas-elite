'use client'
import { useTransition } from 'react'
import { approveUser, revokeUser, changeRole, deleteProfile } from '@/app/admin/actions/users'
import type { Profile } from '@/lib/types'
import { CheckCircle, XCircle, ShieldAlert, User } from 'lucide-react'

interface Props {
  profiles: Profile[]
  currentUserId: string
}

export function UserManager({ profiles, currentUserId }: Props) {
  const pending = profiles.filter((p) => !p.approved)
  const active = profiles.filter((p) => p.approved)

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div>
          <h2 className="font-semibold text-[#0f1e35] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            Pendientes de aprobación ({pending.length})
          </h2>
          <div className="bg-white rounded-xl border border-[#dde3f0] divide-y divide-[#dde3f0]">
            {pending.map((p) => (
              <UserRow key={p.id} profile={p} currentUserId={currentUserId} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-[#0f1e35] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          Equipo activo ({active.length})
        </h2>
        <div className="bg-white rounded-xl border border-[#dde3f0] divide-y divide-[#dde3f0]">
          {active.map((p) => (
            <UserRow key={p.id} profile={p} currentUserId={currentUserId} />
          ))}
        </div>
      </div>
    </div>
  )
}

function UserRow({ profile: p, currentUserId }: { profile: Profile; currentUserId: string }) {
  const [isPending, startTransition] = useTransition()
  const isSelf = p.id === currentUserId

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-full bg-[#c9a030]/20 flex items-center justify-center text-[#c9a030] text-sm font-bold shrink-0">
        {(p.full_name ?? p.email)[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#0f1e35] truncate">{p.full_name ?? p.email}</p>
        <p className="text-xs text-[#6b7a99] truncate">{p.email}</p>
      </div>

      {!isSelf && (
        <div className="flex items-center gap-2 shrink-0">
          {p.approved ? (
            <>
              <select
                defaultValue={p.role}
                disabled={isPending}
                onChange={(e) => startTransition(() => changeRole(p.id, e.target.value as 'admin' | 'employee'))}
                className="text-xs border border-[#dde3f0] rounded-lg px-2 py-1.5 text-[#0f1e35] bg-white focus:outline-none focus:ring-1 focus:ring-navy disabled:opacity-50"
              >
                <option value="employee">Empleado</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={() => startTransition(() => revokeUser(p.id))}
                disabled={isPending}
                title="Revocar acceso"
                className="p-1.5 text-[#6b7a99] hover:text-red-500 disabled:opacity-50 transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <span className="text-xs text-amber-600 font-medium px-2 py-1 bg-amber-50 rounded-lg">Pendiente</span>
              <button
                onClick={() => startTransition(() => approveUser(p.id))}
                disabled={isPending}
                title="Aprobar acceso"
                className="p-1.5 text-emerald-500 hover:text-emerald-700 disabled:opacity-50 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => startTransition(() => deleteProfile(p.id))}
                disabled={isPending}
                title="Rechazar y eliminar"
                className="p-1.5 text-[#6b7a99] hover:text-red-500 disabled:opacity-50 transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}

      {isSelf && (
        <span className="text-xs text-navy font-semibold px-2 py-1 bg-navy/8 rounded-lg shrink-0 flex items-center gap-1">
          {p.role === 'admin' ? <ShieldAlert className="w-3 h-3" /> : <User className="w-3 h-3" />}
          Tú
        </span>
      )}
    </div>
  )
}
