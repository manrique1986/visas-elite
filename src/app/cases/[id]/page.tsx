import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { StatusBadge } from '@/components/ui/badge'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { CaseNotes } from '@/components/cases/case-notes'
import { MeetingScheduler } from '@/components/cases/meeting-scheduler'
import { StatusSelector } from '@/components/cases/status-selector'
import Link from 'next/link'
import { ArrowLeft, Plane, Hotel, CalendarDays, GraduationCap, ImageDown, Pencil, MessageSquare } from 'lucide-react'
import type { Profile } from '@/lib/types'
import { formatDate, formatDateTime, formatDateLong } from '@/lib/utils'
import { DeleteCaseButton } from '@/components/cases/delete-case-button'

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile?.approved) redirect('/pending')

  const { data: caseData } = await supabase
    .from('cases')
    .select('*, case_details(*), training_sessions(*)')
    .eq('id', id)
    .single()

  if (!caseData) notFound()

  const [{ data: notes }, { data: meetings }] = await Promise.all([
    supabase
      .from('case_notes')
      .select('*, profiles(full_name, avatar_url)')
      .eq('case_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('onboarding_meetings')
      .select('*')
      .eq('case_id', id)
      .order('scheduled_at', { ascending: true }),
  ])

  const detail = caseData.case_details?.[0]
  const trainings = caseData.training_sessions ?? []

  return (
    <div className="flex min-h-screen">
      <Sidebar profile={profile as Profile} />
      <main className="flex-1 lg:ml-60 pt-16 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <Link
                href="/cases"
                className="inline-flex items-center gap-1 text-sm text-[#6b7a99] hover:text-[#0f1e35] mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Casos
              </Link>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[#0f1e35]">Familia {caseData.family_name}</h1>
                <StatusBadge status={caseData.status} />
              </div>
              <p className="text-[#6b7a99] text-sm mt-0.5">
                Creado el {formatDate(caseData.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              {profile?.role === 'admin' && <DeleteCaseButton caseId={id} />}
              <Link
                href={`/cases/${id}/edit`}
                className="inline-flex items-center gap-2 bg-white border border-[#dde3f0] text-[#0f1e35] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#f4f6fb] transition-colors"
              >
                <Pencil className="w-4 h-4" />
                <span className="hidden sm:inline">Editar</span>
              </Link>
              <Link
                href={`/cases/${id}/image`}
                className="inline-flex items-center gap-2 bg-gold text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#b08020] transition-colors"
              >
                <ImageDown className="w-4 h-4" />
                <span className="hidden sm:inline">Generar Imagen</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Status */}
              <Card>
                <CardHeader>
                  <p className="text-sm font-semibold text-[#0f1e35]">Estado del Caso</p>
                </CardHeader>
                <CardBody>
                  <StatusSelector caseId={id} currentStatus={caseData.status} />
                </CardBody>
              </Card>

              {/* Members */}
              {(detail?.son_name || detail?.father_name) && (
                <Card>
                  <CardHeader>
                    <p className="text-sm font-semibold text-[#0f1e35]">Integrantes</p>
                  </CardHeader>
                  <CardBody className="space-y-2 text-sm">
                    {detail?.son_name && (
                      <div className="flex gap-2">
                        <span className="text-[#6b7a99] w-24 shrink-0">Hijo:</span>
                        <span className="text-[#0f1e35] font-medium">{detail.son_name}</span>
                      </div>
                    )}
                    {detail?.father_name && (
                      <div className="flex gap-2">
                        <span className="text-[#6b7a99] w-24 shrink-0">Padre:</span>
                        <span className="text-[#0f1e35] font-medium">{detail.father_name}</span>
                      </div>
                    )}
                  </CardBody>
                </Card>
              )}

              {/* Appointments */}
              {(detail?.cas_appointment || detail?.consular_appointment) && (
                <Card>
                  <CardHeader className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-navy" />
                    <p className="text-sm font-semibold text-[#0f1e35]">Citas</p>
                  </CardHeader>
                  <CardBody className="space-y-3 text-sm">
                    {detail?.cas_appointment && (
                      <div className="flex justify-between">
                        <span className="text-[#6b7a99]">Cita CAS:</span>
                        <span className="text-[#0f1e35] font-medium">{formatDateTime(detail.cas_appointment)}</span>
                      </div>
                    )}
                    {detail?.consular_appointment && (
                      <div className="flex justify-between">
                        <span className="text-[#6b7a99]">Cita Consular:</span>
                        <span className="text-[#0f1e35] font-medium">{formatDateTime(detail.consular_appointment)}</span>
                      </div>
                    )}
                  </CardBody>
                </Card>
              )}

              {/* Flights */}
              {(detail?.arrival_flight_code || detail?.departure_flight_code) && (
                <Card>
                  <CardHeader className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-navy" />
                    <p className="text-sm font-semibold text-[#0f1e35]">Vuelos</p>
                  </CardHeader>
                  <CardBody className="space-y-4 text-sm">
                    {detail?.arrival_flight_code && (
                      <div>
                        <p className="text-xs text-[#6b7a99] font-semibold uppercase tracking-wide mb-1">Llegada</p>
                        <p className="text-[#0f1e35] font-semibold">{detail.arrival_flight_code}</p>
                        <p className="text-[#6b7a99]">
                          {detail.arrival_origin} {detail.arrival_departure_time} → {detail.arrival_destination} {detail.arrival_arrival_time}
                          {detail.arrival_date && ` · ${formatDateLong(detail.arrival_date)}`}
                        </p>
                      </div>
                    )}
                    {detail?.departure_flight_code && (
                      <div>
                        <p className="text-xs text-[#6b7a99] font-semibold uppercase tracking-wide mb-1">Salida</p>
                        <p className="text-[#0f1e35] font-semibold">{detail.departure_flight_code}</p>
                        <p className="text-[#6b7a99]">
                          {detail.departure_origin} {detail.departure_departure_time} → {detail.departure_destination} {detail.departure_arrival_time}
                          {detail.departure_date && ` · ${formatDateLong(detail.departure_date)}`}
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              )}

              {/* Hotel */}
              {detail?.hotel_name && (
                <Card>
                  <CardHeader className="flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-navy" />
                    <p className="text-sm font-semibold text-[#0f1e35]">Hospedaje</p>
                  </CardHeader>
                  <CardBody className="space-y-2 text-sm">
                    <p className="text-[#0f1e35] font-semibold">{detail.hotel_name}</p>
                    {detail.hotel_address && <p className="text-[#6b7a99]">{detail.hotel_address}</p>}
                    {(detail.checkin_date || detail.checkout_date) && (
                      <p className="text-[#6b7a99]">
                        Check-in: {formatDate(detail.checkin_date)} · Check-out: {formatDate(detail.checkout_date)}
                      </p>
                    )}
                  </CardBody>
                </Card>
              )}

              {/* Comments */}
              {detail?.comments && (
                <Card>
                  <CardHeader className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-navy" />
                    <p className="text-sm font-semibold text-[#0f1e35]">Comentarios</p>
                  </CardHeader>
                  <CardBody>
                    <p className="text-sm text-[#0f1e35] whitespace-pre-wrap">{detail.comments}</p>
                  </CardBody>
                </Card>
              )}

              {/* Training */}
              {trainings.length > 0 && (
                <Card>
                  <CardHeader className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-navy" />
                    <p className="text-sm font-semibold text-[#0f1e35]">Entrenamientos</p>
                  </CardHeader>
                  <CardBody className="space-y-2 text-sm">
                    {trainings.map((t: { id: string; session_date: string }) => (
                      <div key={t.id} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#c9a030]" />
                        <span className="text-[#0f1e35]">{formatDateLong(t.session_date)}</span>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              )}
            </div>

            {/* Right column — Notes + Meetings */}
            <div className="space-y-5">
              <MeetingScheduler
                caseId={id}
                currentUserId={user.id}
                meetings={meetings ?? []}
              />
              <CaseNotes
                caseId={id}
                notes={notes ?? []}
                currentUserId={user.id}
                currentProfile={profile as Profile}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
