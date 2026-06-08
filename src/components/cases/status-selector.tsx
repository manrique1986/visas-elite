'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { statusConfig } from '@/lib/utils'
import type { CaseStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const statuses: CaseStatus[] = ['en_proceso', 'aprobada', 'negada']

export function StatusSelector({ caseId, currentStatus }: { caseId: string; currentStatus: CaseStatus }) {
  const [status, setStatus] = useState<CaseStatus>(currentStatus)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function handleChange(newStatus: CaseStatus) {
    if (newStatus === status) return
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('cases')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', caseId)
    setStatus(newStatus)
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {statuses.map((s) => {
        const config = statusConfig[s]
        const active = status === s
        return (
          <button
            key={s}
            onClick={() => handleChange(s)}
            disabled={saving}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all',
              active
                ? `${config.bg} ${config.color} ring-2 ring-offset-1 ${s === 'en_proceso' ? 'ring-amber-400' : s === 'aprobada' ? 'ring-emerald-400' : 'ring-red-400'}`
                : 'border-[#dde3f0] text-[#6b7a99] hover:border-[#0f2447]/30 hover:text-[#0f1e35]'
            )}
          >
            {config.label}
          </button>
        )
      })}
      {saving && <span className="text-xs text-[#6b7a99] self-center">Guardando...</span>}
    </div>
  )
}
