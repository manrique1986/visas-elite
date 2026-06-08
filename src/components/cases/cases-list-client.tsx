'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SearchInput } from '@/components/ui/search-input'
import { ArrowRight, FolderOpen, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Case } from '@/lib/types'

interface CasesListClientProps {
  cases: Case[]
}

export function CasesListClient({ cases }: CasesListClientProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return cases
    const q = query.toLowerCase()
    return cases.filter((c) => c.family_name.toLowerCase().includes(q))
  }, [cases, query])

  return (
    <div className="space-y-4">
      <SearchInput
        placeholder="Buscar por apellido de familia..."
        onSearch={setQuery}
      />

      {filtered.length > 0 ? (
        <Card>
          <div className="divide-y divide-[#dde3f0]">
            {filtered.map((c: Case) => (
              <Link
                key={c.id}
                href={`/cases/${c.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#f4f6fb] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy/8 rounded-xl flex items-center justify-center group-hover:bg-navy/12 transition-colors">
                    <span className="text-navy font-bold">{c.family_name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f1e35]">Familia {c.family_name}</p>
                    <p className="text-xs text-[#6b7a99]">Actualizado: {formatDate(c.updated_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={c.status} />
                  <ArrowRight className="w-4 h-4 text-[#6b7a99]" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      ) : query ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-[#6b7a99] font-medium">Sin resultados para "{query}"</p>
            <p className="text-[#6b7a99] text-sm mt-1">Intenta con otro apellido</p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-16">
            <FolderOpen className="w-12 h-12 text-[#dde3f0] mx-auto mb-3" />
            <p className="text-[#6b7a99] font-medium">No hay casos registrados</p>
            <p className="text-[#6b7a99] text-sm mb-5">Comienza creando el primer caso de familia</p>
            <Link
              href="/cases/new"
              className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear caso
            </Link>
          </div>
        </Card>
      )}

      {query && filtered.length > 0 && (
        <p className="text-xs text-[#6b7a99] text-right">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "{query}"
        </p>
      )}
    </div>
  )
}
