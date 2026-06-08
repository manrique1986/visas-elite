'use client'
import { useState } from 'react'
import { statusConfig } from '@/lib/utils'
import type { CaseStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const statuses: CaseStatus[] = ['en_proceso', 'aprobada', 'negada']

export function DemoStatusSelector({ initialStatus }: { initialStatus: CaseStatus }) {
  const [status, setStatus] = useState<CaseStatus>(initialStatus)
  const [saved, setSaved] = useState(false)

  function handleChange(s: CaseStatus) {
    setStatus(s)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="flex gap-2 flex-wrap items-center">
      {statuses.map((s) => {
        const config = statusConfig[s]
        const active = status === s
        return (
          <button
            key={s}
            onClick={() => handleChange(s)}
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
      {saved && (
        <span className="text-xs text-emerald-600 font-medium animate-pulse">✓ Guardado</span>
      )}
    </div>
  )
}
