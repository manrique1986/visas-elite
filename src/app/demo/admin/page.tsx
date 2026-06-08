import { DemoSidebar } from '@/components/layout/demo-sidebar'
import { StatusBadge } from '@/components/ui/badge'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { ShieldCheck, Users, FolderOpen, CheckCircle, XCircle, Clock, ArrowRight, Video } from 'lucide-react'
import { DEMO_CASES, DEMO_TEAM, DEMO_MEETINGS } from '@/lib/demo-data'
import { formatDate } from '@/lib/utils'

export default function DemoAdminPage() {
  const stats = {
    total: DEMO_CASES.length,
    employees: DEMO_TEAM.length,
    en_proceso: DEMO_CASES.filter(c => c.status === 'en_proceso').length,
    aprobada: DEMO_CASES.filter(c => c.status === 'aprobada').length,
    negada: DEMO_CASES.filter(c => c.status === 'negada').length,
  }

  return (
    <div className="flex min-h-screen">
      <DemoSidebar isAdmin />
      <main className="flex-1 lg:ml-60 pt-16 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[#c9a030]" />
              <h1 className="text-2xl font-bold text-[#0f1e35]">Panel Administrador</h1>
            </div>
            <p className="text-[#6b7a99] text-sm">Bienvenida, Catalina — Vista completa del negocio</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Casos', value: stats.total, icon: FolderOpen, color: 'text-[#0f2447]', bg: 'bg-[#0f2447]/8' },
              { label: 'Empleados', value: stats.employees, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'En Proceso', value: stats.en_proceso, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Aprobadas', value: stats.aprobada, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Negadas', value: stats.negada, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
            ].map((s) => {
              const Icon = s.icon
              return (
                <Card key={s.label}>
                  <CardBody className="flex items-center gap-3 py-3">
                    <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#0f1e35]">{s.value}</p>
                      <p className="text-xs text-[#6b7a99]">{s.label}</p>
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
                <div className="divide-y divide-[#dde3f0]">
                  {DEMO_CASES.map((c) => {
                    const employee = DEMO_TEAM.find(t => t.id === c.created_by)
                    return (
                      <Link
                        key={c.id}
                        href={`/demo/cases/${c.id}`}
                        className="flex items-center justify-between px-5 py-4 hover:bg-[#f4f6fb] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0f2447]/8 rounded-xl flex items-center justify-center">
                            <span className="text-[#0f2447] font-bold">{c.family_name[0]}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-[#0f1e35]">Familia {c.family_name}</p>
                            <p className="text-xs text-[#6b7a99]">
                              {employee?.name ?? '—'} · {formatDate(c.updated_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={c.status} />
                          <ArrowRight className="w-4 h-4 text-[#6b7a99]" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-6">

              {/* Meetings */}
              <div>
                <h2 className="font-semibold text-[#0f1e35] mb-4">Próximas Reuniones</h2>
                <Card>
                  <div className="divide-y divide-[#dde3f0]">
                    {DEMO_MEETINGS.map((m) => (
                      <div key={m.id} className="px-4 py-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-[#0f1e35]">Familia {m.family}</p>
                            <p className="text-xs text-[#6b7a99] mt-0.5">{m.date}</p>
                          </div>
                          <div className="flex items-center gap-1.5 bg-[#0f2447]/8 text-[#0f2447] text-xs font-semibold px-2 py-1 rounded-lg shrink-0">
                            <Video className="w-3 h-3" />
                            Meet
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-[#dde3f0] bg-[#f4f6fb] rounded-b-xl">
                    <p className="text-xs text-[#6b7a99] text-center">
                      Catalina recibe notificación automática al agendar
                    </p>
                  </div>
                </Card>
              </div>

              {/* Team */}
              <div>
                <h2 className="font-semibold text-[#0f1e35] mb-4">Equipo</h2>
                <Card>
                  <div className="divide-y divide-[#dde3f0]">
                    {DEMO_TEAM.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 px-4 py-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                          style={{ background: member.color }}
                        >
                          {member.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0f1e35] truncate">{member.name}</p>
                          <p className="text-xs text-[#6b7a99]">
                            {member.role === 'admin' ? 'Administrador' : 'Empleado'}
                          </p>
                        </div>
                        {member.role === 'admin' && (
                          <ShieldCheck className="w-4 h-4 text-[#c9a030] shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
