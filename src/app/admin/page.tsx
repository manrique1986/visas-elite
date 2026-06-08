import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { StatusBadge } from '@/components/ui/badge'
import { Card, CardBody } from '@/components/ui/card'
import Link from 'next/link'
import { Users, FolderOpen, CheckCircle, XCircle, Clock, ArrowRight, ShieldAlert } from 'lucide-react'
import type { Case, Profile } from '@/lib/types'
import { formatDate, formatDateTime } from '@/lib/utils'
import { UserManager } from '@/components/admin/user-manager'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  const [{ data: allCases }, { data: profiles }, { data: meetings }] = await Promise.all([
    supabase.from('cases').select('*, profiles!cases_created_by_fkey(full_name)').order('updated_at', { ascending: false }),
    supabase.from('profiles').select('*').order('created_at'),
    supabase
      .from('onboarding_meetings')
      .select('*, cases(family_name)')
      .order('scheduled_at', { ascending: true })
      .gte('scheduled_at', new Date().toISOString())
      .limit(10),
  ])

  const stats = {
    total: allCases?.length ?? 0,
    en_proceso: allCases?.filter((c) => c.status === 'en_proceso').length ?? 0,
    aprobada: allCases?.filter((c) => c.status === 'aprobada').length ?? 0,
    negada: allCases?.filter((c) => c.status === 'negada').length ?? 0,
    employees: profiles?.length ?? 0,
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar profile={profile as Profile} />
      <main className="flex-1 lg:ml-60 pt-16 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-[#c9a030]" />
              <h1 className="text-2xl font-bold text-[#0f1e35]">Panel Administrador</h1>
            </div>
            <p className="text-[#6b7a99] text-sm">Vista completa de todos los casos y el equipo</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total', value: stats.total, icon: FolderOpen, color: 'text-navy', bg: 'bg-navy/8' },
              { label: 'Empleados', value: stats.employees, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'En Proceso', value: stats.en_proceso, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Aprobadas', value: stats.aprobada, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Negadas', value: stats.negada, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label}>
                  <CardBody className="flex items-center gap-3 py-3">
                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#0f1e35]">{stat.value}</p>
                      <p className="text-xs text-[#6b7a99]">{stat.label}</p>
                    </div>
                  </CardBody>
                </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* All cases */}
            <div className="lg:col-span-2">
              <h2 className="font-semibold text-[#0f1e35] mb-4">Todos los Casos</h2>
              <Card>
                {allCases && allCases.length > 0 ? (
                  <div className="divide-y divide-[#dde3f0]">
                    {allCases.map((c: Case & { profiles?: { full_name: string } }) => (
                      <Link
                        key={c.id}
                        href={`/cases/${c.id}`}
                        className="flex items-center justify-between px-5 py-3.5 hover:bg-[#f4f6fb] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-navy/8 rounded-lg flex items-center justify-center">
                            <span className="text-navy font-bold text-sm">{c.family_name[0]}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-[#0f1e35] text-sm">Familia {c.family_name}</p>
                            <p className="text-xs text-[#6b7a99]">
                              {c.profiles?.full_name ?? 'Sin asignar'} · {formatDate(c.updated_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={c.status} />
                          <ArrowRight className="w-3.5 h-3.5 text-[#6b7a99]" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <CardBody className="text-center py-10 text-[#6b7a99] text-sm">
                    No hay casos registrados
                  </CardBody>
                )}
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Upcoming meetings */}
              <div>
                <h2 className="font-semibold text-[#0f1e35] mb-4">Próximas Reuniones</h2>
                <Card>
                  {meetings && meetings.length > 0 ? (
                    <div className="divide-y divide-[#dde3f0]">
                      {meetings.map((m) => (
                        <div key={m.id} className="px-4 py-3">
                          <p className="text-sm font-semibold text-[#0f1e35]">
                            Familia {(m.cases as { family_name: string })?.family_name}
                          </p>
                          <p className="text-xs text-[#6b7a99]">{formatDateTime(m.scheduled_at)}</p>
                          {m.meet_url && (
                            <a
                              href={m.meet_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-navy hover:underline"
                            >
                              Unirse al Meet
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <CardBody className="text-center py-8 text-[#6b7a99] text-sm">
                      No hay reuniones próximas
                    </CardBody>
                  )}
                </Card>
              </div>

              {/* Team */}
              <div>
                <h2 className="font-semibold text-[#0f1e35] mb-4">Equipo</h2>
                <UserManager profiles={(profiles ?? []) as Profile[]} currentUserId={user.id} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
