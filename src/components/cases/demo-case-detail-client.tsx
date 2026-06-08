'use client'
import { useState, useEffect } from 'react'
import { StatusBadge } from '@/components/ui/badge'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { DemoStatusSelector } from '@/components/cases/demo-status-selector'
import { DemoNotes } from '@/components/cases/demo-notes'
import { DemoMeetingScheduler } from '@/components/cases/demo-meeting-scheduler'
import Link from 'next/link'
import { ArrowLeft, Plane, Hotel, CalendarDays, GraduationCap, ImageDown, Users, Pencil, RotateCcw } from 'lucide-react'
import type { DemoCase } from '@/lib/demo-data'
import { formatDate, formatDateLong, formatDateTime } from '@/lib/utils'

interface Props {
  staticCase: DemoCase
}

export function DemoCaseDetailClient({ staticCase }: Props) {
  const [caseData, setCaseData] = useState(staticCase)
  const [hasLocalEdits, setHasLocalEdits] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(`demo_case_${staticCase.id}`)
    if (saved) {
      try {
        setCaseData(JSON.parse(saved))
        setHasLocalEdits(true)
      } catch {
        // ignore malformed data
      }
    }
  }, [staticCase.id])

  function resetEdits() {
    localStorage.removeItem(`demo_case_${staticCase.id}`)
    setCaseData(staticCase)
    setHasLocalEdits(false)
  }

  const d = caseData.detail

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <Link href="/demo/cases" className="inline-flex items-center gap-1 text-sm text-[#6b7a99] hover:text-[#0f1e35] mb-3">
            <ArrowLeft className="w-3.5 h-3.5" />
            Casos
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-[#0f1e35]">Familia {caseData.family_name}</h1>
            <StatusBadge status={caseData.status} />
            {hasLocalEdits && (
              <span className="inline-flex items-center gap-1 bg-[#c9a030]/15 text-[#c9a030] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#c9a030]/30">
                Editado
              </span>
            )}
          </div>
          <p className="text-[#6b7a99] text-sm mt-0.5">
            Creado el {formatDate(caseData.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {hasLocalEdits && (
            <button
              onClick={resetEdits}
              className="inline-flex items-center gap-1.5 text-[#6b7a99] hover:text-[#0f1e35] text-sm px-3 py-2 rounded-lg hover:bg-[#f4f6fb] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer
            </button>
          )}
          <Link
            href={`/demo/cases/${staticCase.id}/edit`}
            className="inline-flex items-center gap-2 bg-white border border-[#dde3f0] text-[#0f1e35] px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#f4f6fb] transition-colors shadow-sm"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </Link>
          <Link
            href={`/demo/cases/${staticCase.id}/image`}
            className="inline-flex items-center gap-2 bg-[#c9a030] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#b08020] transition-colors shadow-sm"
          >
            <ImageDown className="w-4 h-4" />
            Generar Imagen
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Status */}
          <Card>
            <CardHeader><p className="text-sm font-semibold text-[#0f1e35]">Estado del Caso</p></CardHeader>
            <CardBody>
              <DemoStatusSelector initialStatus={caseData.status} />
            </CardBody>
          </Card>

          {/* Members */}
          <Card>
            <CardHeader className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0f2447]" />
              <p className="text-sm font-semibold text-[#0f1e35]">Integrantes</p>
            </CardHeader>
            <CardBody className="space-y-2 text-sm">
              {d.son_name && (
                <div className="flex gap-2">
                  <span className="text-[#6b7a99] w-20 shrink-0">Hijo:</span>
                  <span className="text-[#0f1e35] font-medium">{d.son_name}</span>
                </div>
              )}
              {d.father_name && (
                <div className="flex gap-2">
                  <span className="text-[#6b7a99] w-20 shrink-0">Padre:</span>
                  <span className="text-[#0f1e35] font-medium">{d.father_name}</span>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Appointments */}
          {(d.cas_appointment || d.consular_appointment) && (
            <Card>
              <CardHeader className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#0f2447]" />
                <p className="text-sm font-semibold text-[#0f1e35]">Citas</p>
              </CardHeader>
              <CardBody className="space-y-3 text-sm">
                {d.cas_appointment && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#6b7a99]">Cita CAS:</span>
                    <span className="font-semibold text-[#0f1e35]">{formatDateTime(d.cas_appointment)}</span>
                  </div>
                )}
                {d.consular_appointment && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#6b7a99]">Cita Consular:</span>
                    <span className="font-semibold text-[#0f1e35]">{formatDateTime(d.consular_appointment)}</span>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* Flights */}
          {(d.arrival_flight_code || d.departure_flight_code) && (
            <Card>
              <CardHeader className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#0f2447]" />
                <p className="text-sm font-semibold text-[#0f1e35]">Vuelos</p>
              </CardHeader>
              <CardBody className="space-y-4 text-sm">
                {d.arrival_flight_code && (
                  <div>
                    <p className="text-xs text-[#6b7a99] font-semibold uppercase tracking-wide mb-1.5">Llegada</p>
                    <p className="font-bold text-[#0f1e35] text-base">{d.arrival_flight_code}</p>
                    <p className="text-[#6b7a99]">
                      {d.arrival_origin} {d.arrival_departure_time} → {d.arrival_destination} {d.arrival_arrival_time}
                      {d.arrival_date && <>&nbsp;·&nbsp;{formatDateLong(d.arrival_date)}</>}
                    </p>
                  </div>
                )}
                {d.departure_flight_code && (
                  <div className={d.arrival_flight_code ? 'border-t border-[#dde3f0] pt-4' : ''}>
                    <p className="text-xs text-[#6b7a99] font-semibold uppercase tracking-wide mb-1.5">Salida</p>
                    <p className="font-bold text-[#0f1e35] text-base">{d.departure_flight_code}</p>
                    <p className="text-[#6b7a99]">
                      {d.departure_origin} {d.departure_departure_time} → {d.departure_destination} {d.departure_arrival_time}
                      {d.departure_date && <>&nbsp;·&nbsp;{formatDateLong(d.departure_date)}</>}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* Hotel */}
          {d.hotel_name && (
            <Card>
              <CardHeader className="flex items-center gap-2">
                <Hotel className="w-4 h-4 text-[#0f2447]" />
                <p className="text-sm font-semibold text-[#0f1e35]">Hospedaje</p>
              </CardHeader>
              <CardBody className="space-y-1.5 text-sm">
                <p className="font-bold text-[#0f1e35] text-base">{d.hotel_name}</p>
                {d.hotel_address && <p className="text-[#6b7a99]">{d.hotel_address}</p>}
                {(d.checkin_date || d.checkout_date) && (
                  <p className="text-[#6b7a99]">
                    Check-in: {d.checkin_date ? formatDateLong(d.checkin_date) : '—'}&nbsp;·&nbsp;Check-out: {d.checkout_date ? formatDateLong(d.checkout_date) : '—'}
                  </p>
                )}
              </CardBody>
            </Card>
          )}

          {/* Training */}
          {caseData.training_sessions.length > 0 && (
            <Card>
              <CardHeader className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#0f2447]" />
                <p className="text-sm font-semibold text-[#0f1e35]">Entrenamientos Presenciales</p>
              </CardHeader>
              <CardBody className="space-y-2 text-sm">
                {caseData.training_sessions.map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c9a030]" />
                    <span className="text-[#0f1e35] font-medium">{formatDateLong(t.session_date)}</span>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}
        </div>

        {/* Meetings + Notes */}
        <div className="space-y-5">
          <DemoMeetingScheduler />
          <DemoNotes initialNotes={caseData.notes} />
        </div>
      </div>
    </div>
  )
}
