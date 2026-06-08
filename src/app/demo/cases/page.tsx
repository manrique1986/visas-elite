'use client'
import { useState, useMemo } from 'react'
import { DemoSidebar } from '@/components/layout/demo-sidebar'
import { StatusBadge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SearchInput } from '@/components/ui/search-input'
import Link from 'next/link'
import { Plus, ArrowRight, FolderOpen, CheckCircle, XCircle, Clock } from 'lucide-react'
import { DEMO_CASES } from '@/lib/demo-data'
import { formatDate } from '@/lib/utils'

export default function DemoCasesPage() {
  const [query, setQuery] = useState('')

  const stats = {
    total: DEMO_CASES.length,
    en_proceso: DEMO_CASES.filter(c => c.status === 'en_proceso').length,
    aprobada: DEMO_CASES.filter(c => c.status === 'aprobada').length,
    negada: DEMO_CASES.filter(c => c.status === 'negada').length,
  }

  const filtered = useMemo(() => {
    if (!query.trim()) return DEMO_CASES
    const q = query.toLowerCase()
    return DEMO_CASES.filter(c => c.family_name.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="flex min-h-screen">
      <DemoSidebar />
      <main className="flex-1 lg:ml-60 pt-16 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#0f1e35]">Mis Casos</h1>
              <p className="text-[#6b7a99] text-sm mt-0.5">Bienvenida, María</p>
            </div>
            <Link
              href="/demo/cases/new"
              className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Caso
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: FolderOpen, color: 'text-[#0f2447]', bg: 'bg-[#0f2447]/8' },
              { label: 'En Proceso', value: stats.en_proceso, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Aprobadas', value: stats.aprobada, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Negadas', value: stats.negada, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
            ].map((s) => {
              const Icon = s.icon
              return (
                <Card key={s.label}>
                  <div className="px-5 py-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#0f1e35]">{s.value}</p>
                      <p className="text-xs text-[#6b7a99]">{s.label}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Search */}
          <div className="mb-4">
            <SearchInput
              placeholder="Buscar por apellido de familia..."
              onSearch={setQuery}
            />
          </div>

          {/* Cases list */}
          {filtered.length > 0 ? (
            <Card>
              <div className="divide-y divide-[#dde3f0]">
                {filtered.map((c) => (
                  <Link
                    key={c.id}
                    href={`/demo/cases/${c.id}`}
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
          ) : (
            <Card>
              <div className="text-center py-12">
                <p className="text-[#6b7a99] font-medium">Sin resultados para "{query}"</p>
                <p className="text-[#6b7a99] text-sm mt-1">Intenta con otro apellido</p>
              </div>
            </Card>
          )}

          {query && filtered.length > 0 && (
            <p className="text-xs text-[#6b7a99] text-right mt-2">
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "{query}"
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
