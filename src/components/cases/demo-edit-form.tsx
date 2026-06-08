'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Plus, Trash2, Users, Plane, Hotel, CalendarDays, GraduationCap, CheckCircle } from 'lucide-react'
import type { DemoCase } from '@/lib/demo-data'

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 bg-navy/10 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-navy" />
      </div>
      <h3 className="font-semibold text-[#0f1e35]">{title}</h3>
    </div>
  )
}

function toDatetimeLocal(val: string | null | undefined) {
  if (!val) return ''
  return val.substring(0, 16)
}

interface DemoEditFormProps {
  caseData: DemoCase
}

export function DemoEditForm({ caseData }: DemoEditFormProps) {
  const router = useRouter()
  const d = caseData.detail

  const [form, setForm] = useState({
    family_name: caseData.family_name,
    son_name: d.son_name ?? '',
    father_name: d.father_name ?? '',
    cas_appointment: toDatetimeLocal(d.cas_appointment),
    consular_appointment: toDatetimeLocal(d.consular_appointment),
    arrival_flight_code: d.arrival_flight_code ?? '',
    arrival_origin: d.arrival_origin ?? '',
    arrival_departure_time: d.arrival_departure_time ?? '',
    arrival_destination: d.arrival_destination ?? '',
    arrival_arrival_time: d.arrival_arrival_time ?? '',
    arrival_date: d.arrival_date ?? '',
    departure_flight_code: d.departure_flight_code ?? '',
    departure_origin: d.departure_origin ?? '',
    departure_departure_time: d.departure_departure_time ?? '',
    departure_destination: d.departure_destination ?? '',
    departure_arrival_time: d.departure_arrival_time ?? '',
    departure_date: d.departure_date ?? '',
    hotel_name: d.hotel_name ?? '',
    hotel_address: d.hotel_address ?? '',
    checkin_date: d.checkin_date ?? '',
    checkout_date: d.checkout_date ?? '',
    training_dates: caseData.training_sessions.map(t => t.session_date),
  })
  const [saved, setSaved] = useState(false)

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function setTrainingDate(index: number, value: string) {
    const dates = [...form.training_dates]
    dates[index] = value
    setForm((prev) => ({ ...prev, training_dates: dates }))
  }

  function addTrainingDate() {
    setForm((prev) => ({ ...prev, training_dates: [...prev.training_dates, ''] }))
  }

  function removeTrainingDate(index: number) {
    setForm((prev) => ({ ...prev, training_dates: prev.training_dates.filter((_, i) => i !== index) }))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()

    const updated = {
      ...caseData,
      family_name: form.family_name.trim() || caseData.family_name,
      updated_at: new Date().toISOString(),
      detail: {
        ...caseData.detail,
        son_name: form.son_name,
        father_name: form.father_name,
        cas_appointment: form.cas_appointment ? `${form.cas_appointment}:00` : caseData.detail.cas_appointment,
        consular_appointment: form.consular_appointment ? `${form.consular_appointment}:00` : caseData.detail.consular_appointment,
        arrival_flight_code: form.arrival_flight_code,
        arrival_origin: form.arrival_origin,
        arrival_departure_time: form.arrival_departure_time,
        arrival_destination: form.arrival_destination,
        arrival_arrival_time: form.arrival_arrival_time,
        arrival_date: form.arrival_date,
        departure_flight_code: form.departure_flight_code,
        departure_origin: form.departure_origin,
        departure_departure_time: form.departure_departure_time,
        departure_destination: form.departure_destination,
        departure_arrival_time: form.departure_arrival_time,
        departure_date: form.departure_date,
        hotel_name: form.hotel_name,
        hotel_address: form.hotel_address,
        checkin_date: form.checkin_date,
        checkout_date: form.checkout_date,
      },
      training_sessions: form.training_dates
        .filter(d => d.trim())
        .map(session_date => ({ session_date })),
    }

    localStorage.setItem(`demo_case_${caseData.id}`, JSON.stringify(updated))
    setSaved(true)
    setTimeout(() => router.push(`/demo/cases/${caseData.id}`), 600)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Family */}
      <Card>
        <CardHeader>
          <SectionTitle icon={Users} title="Información de la Familia" />
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Apellido de la Familia"
            value={form.family_name}
            onChange={(e) => set('family_name', e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre del Hijo"
              value={form.son_name}
              onChange={(e) => set('son_name', e.target.value)}
            />
            <Input
              label="Nombre del Padre/Madre"
              value={form.father_name}
              onChange={(e) => set('father_name', e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Appointments */}
      <Card>
        <CardHeader>
          <SectionTitle icon={CalendarDays} title="Citas" />
        </CardHeader>
        <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="datetime-local"
            label="Cita CAS"
            value={form.cas_appointment}
            onChange={(e) => set('cas_appointment', e.target.value)}
          />
          <Input
            type="datetime-local"
            label="Cita Consular"
            value={form.consular_appointment}
            onChange={(e) => set('consular_appointment', e.target.value)}
          />
        </CardBody>
      </Card>

      {/* Arrival flight */}
      <Card>
        <CardHeader>
          <SectionTitle icon={Plane} title="Vuelo de Llegada" />
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Código de Vuelo"
              value={form.arrival_flight_code}
              onChange={(e) => set('arrival_flight_code', e.target.value.toUpperCase())}
            />
            <Input
              type="date"
              label="Fecha de Llegada"
              value={form.arrival_date}
              onChange={(e) => set('arrival_date', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Origen"
              value={form.arrival_origin}
              onChange={(e) => set('arrival_origin', e.target.value.toUpperCase())}
            />
            <Input
              type="time"
              label="Hora de Salida"
              value={form.arrival_departure_time}
              onChange={(e) => set('arrival_departure_time', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Destino"
              value={form.arrival_destination}
              onChange={(e) => set('arrival_destination', e.target.value.toUpperCase())}
            />
            <Input
              type="time"
              label="Hora de Llegada"
              value={form.arrival_arrival_time}
              onChange={(e) => set('arrival_arrival_time', e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Departure flight */}
      <Card>
        <CardHeader>
          <SectionTitle icon={Plane} title="Vuelo de Salida" />
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Código de Vuelo"
              value={form.departure_flight_code}
              onChange={(e) => set('departure_flight_code', e.target.value.toUpperCase())}
            />
            <Input
              type="date"
              label="Fecha de Salida"
              value={form.departure_date}
              onChange={(e) => set('departure_date', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Origen"
              value={form.departure_origin}
              onChange={(e) => set('departure_origin', e.target.value.toUpperCase())}
            />
            <Input
              type="time"
              label="Hora de Salida"
              value={form.departure_departure_time}
              onChange={(e) => set('departure_departure_time', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Destino"
              value={form.departure_destination}
              onChange={(e) => set('departure_destination', e.target.value.toUpperCase())}
            />
            <Input
              type="time"
              label="Hora de Llegada"
              value={form.departure_arrival_time}
              onChange={(e) => set('departure_arrival_time', e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Hotel */}
      <Card>
        <CardHeader>
          <SectionTitle icon={Hotel} title="Hospedaje" />
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Nombre del Hotel"
            value={form.hotel_name}
            onChange={(e) => set('hotel_name', e.target.value)}
          />
          <Input
            label="Dirección"
            value={form.hotel_address}
            onChange={(e) => set('hotel_address', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Check-in"
              value={form.checkin_date}
              onChange={(e) => set('checkin_date', e.target.value)}
            />
            <Input
              type="date"
              label="Check-out"
              value={form.checkout_date}
              onChange={(e) => set('checkout_date', e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Training */}
      <Card>
        <CardHeader>
          <SectionTitle icon={GraduationCap} title="Entrenamientos Presenciales" />
        </CardHeader>
        <CardBody className="space-y-3">
          {form.training_dates.map((date, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="date"
                value={date}
                onChange={(e) => setTrainingDate(index, e.target.value)}
                className="flex-1"
              />
              {form.training_dates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTrainingDate(index)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTrainingDate}
            className="flex items-center gap-2 text-sm text-navy font-medium hover:underline"
          >
            <Plus className="w-4 h-4" />
            Agregar fecha
          </button>
        </CardBody>
      </Card>

      <div className="flex gap-3 justify-end pb-8">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" variant="secondary" loading={saved} className="gap-2">
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              ¡Guardado!
            </>
          ) : (
            'Guardar Cambios'
          )}
        </Button>
      </div>
    </form>
  )
}
