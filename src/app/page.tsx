import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { StatusBadge } from '@/components/ui/badge'
import { Card, CardBody } from '@/components/ui/card'
import Link from 'next/link'
import { FolderOpen, CheckCircle, XCircle, Clock, Plus, ArrowRight } from 'lucide-react'
import type { Case, Profile } from '@/lib/types'
import { formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const query = supabase
    .from('cases')
    .select('*, profiles!cases_created_by_fkey(full_name, avatar_url)')
    .order('updated_at', { ascending: false })
    .limit(8)

  if (profile?.role !== 'admin') {
    query.eq('created_by', user.id)
  }

  const { data: cases } = await query

  const casesQuery = supabase.from('cases').select('status')
  if (profile?.role !== 'admin') {
    casesQuery.eq('created_by', user.id)
  }
  const { data: allCases } = await casesQuery

  const stats = {
    total: allCases?.length ?? 0,
    en_proceso: allCases?.filter((c: { status: string }) => c.status === 'en_proceso').length ?? 0,
    aprobada: allCases?.filter((c: { status: string }) => c.status === 'aprobada').length ?? 0,
    negada: allCases?.filter((c: { status: string }) => c.status === 'negada').length ?? 0,
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar profile={profile as Profile} />

      <main className="flex-1 lg:ml-60 pt-16 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#0f1e35]">Dashboard</h1>
              <p className="text-[#6b7a99] text-sm mt-0.5">
                Bienvenido, {profile?.full_name?.split(' ')[0] ?? 'Usuario'}
              </p>
            </div>
            <Link
              href="/cases/new"
              className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Caso
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Casos', value: stats.total, icon: FolderOpen, color: 'text-navy', bg: 'bg-navy/8' },
              { label: 'En Proceso', value: stats.en_proceso, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Aprobadas', value: stats.aprobada, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Negadas', value: stats.negada, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label}>
                  <CardBody className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#0f1e35]">{stat.value}</p>
                      <p className="text-xs text-[#6b7a99] font-medium">{stat.label}</p>
                    </div>
                  </CardBody>
                </Card>
              )
            })}
          </div>

          {/* Recent cases */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#0f1e35]">Casos Recientes</h2>
            <Link href="/cases" className="text-sm text-navy font-medium flex items-center gap-1 hover:underline">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {cases && cases.length > 0 ? (
            <Card>
              <div className="divide-y divide-[#dde3f0]">
                {cases.map((c: Case & { profiles?: { full_name: string; avatar_url: string } }) => (
                  <Link
                    key={c.id}
                    href={`/cases/${c.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#f4f6fb] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-navy/8 rounded-lg flex items-center justify-center">
                        <span className="text-navy font-bold text-sm">
                          {c.family_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-[#0f1e35] text-sm">Familia {c.family_name}</p>
                        <p className="text-xs text-[#6b7a99]">{formatDate(c.updated_at)}</p>
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
              <CardBody className="text-center py-12">
                <FolderOpen className="w-10 h-10 text-[#dde3f0] mx-auto mb-3" />
                <p className="text-[#6b7a99] font-medium">No hay casos todavía</p>
                <p className="text-[#6b7a99] text-sm mb-4">Crea tu primer caso para comenzar</p>
                <Link
                  href="/cases/new"
                  className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Crear primer caso
                </Link>
              </CardBody>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
