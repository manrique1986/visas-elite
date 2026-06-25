'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Plus, Trash2, Users, Plane, Hotel, CalendarDays, GraduationCap, MessageSquare } from 'lucide-react'
import type { CaseFormData, Profile } from '@/lib/types'

const EMPTY_FORM: CaseFormData = {
  family_name: '',
  son_name: '',
  father_name: '',
  mother_name: '',
  cas_appointment: '',
  consular_appointment: '',
  arrival_flight_code: '',
  arrival_origin: '',
  arrival_departure_time: '',
  arrival_destination: '',
  arrival_arrival_time: '',
  arrival_date: '',
  departure_flight_code: '',
  departure_origin: '',
  departure_departure_time: '',
  departure_destination: '',
  departure_arrival_time: '',
  departure_date: '',
  hotel_name: '',
  hotel_address: '',
  checkin_date: '',
  checkout_date: '',
  trainer_name: '',
  embassy_companion: '',
  comments: '',
  training_dates: [{ date: '', pickup_time: '', end_time: '' }],
}

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

interface CaseFormProps {
  userId: string
  caseId?: string
  detailId?: string
  initialValues?: CaseFormData
  initialAssignedTo?: string | null
  employees?: Pick<Profile, 'id' | 'full_name' | 'email'>[]
}

export function CaseForm({ userId, caseId, detailId, initialValues, initialAssignedTo, employees }: CaseFormProps) {
  const router = useRouter()
  const isEdit = Boolean(caseId)
  const [form, setForm] = useState<CaseFormData>(initialValues ?? EMPTY_FORM)
  const [assignedTo, setAssignedTo] = useState<string>(initialAssignedTo ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof CaseFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function setTrainingField(index: number, field: 'date' | 'pickup_time' | 'end_time', value: string) {
    const updated = form.training_dates.map((t, i) => i === index ? { ...t, [field]: value } : t)
    setForm((prev) => ({ ...prev, training_dates: updated }))
  }

  function addTrainingDate() {
    setForm((prev) => ({ ...prev, training_dates: [...prev.training_dates, { date: '', pickup_time: '', end_time: '' }] }))
  }

  function removeTrainingDate(index: number) {
    setForm((prev) => ({
      ...prev,
      training_dates: prev.training_dates.filter((_, i) => i !== index),
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.family_name.trim()) {
      setError('El nombre de la familia es requerido')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()

    const detailPayload = {
      son_name: form.son_name || null,
      father_name: form.father_name || null,
      mother_name: form.mother_name || null,
      cas_appointment: form.cas_appointment ? `${form.cas_appointment}:00` : null,
      consular_appointment: form.consular_appointment ? `${form.consular_appointment}:00` : null,
      arrival_flight_code: form.arrival_flight_code || null,
      arrival_origin: form.arrival_origin || null,
      arrival_departure_time: form.arrival_departure_time || null,
      arrival_destination: form.arrival_destination || null,
      arrival_arrival_time: form.arrival_arrival_time || null,
      arrival_date: form.arrival_date || null,
      departure_flight_code: form.departure_flight_code || null,
      departure_origin: form.departure_origin || null,
      departure_departure_time: form.departure_departure_time || null,
      departure_destination: form.departure_destination || null,
      departure_arrival_time: form.departure_arrival_time || null,
      departure_date: form.departure_date || null,
      hotel_name: form.hotel_name || null,
      hotel_address: form.hotel_address || null,
      checkin_date: form.checkin_date || null,
      checkout_date: form.checkout_date || null,
      trainer_name: form.trainer_name || null,
      embassy_companion: form.embassy_companion || null,
      comments: form.comments || null,
    }

    const validTrainings = form.training_dates.filter((t) => t.date.trim())

    if (isEdit && caseId) {
      const { error: caseUpdateError } = await supabase
        .from('cases')
        .update({ family_name: form.family_name.trim(), assigned_to: assignedTo || null })
        .eq('id', caseId)

      if (caseUpdateError) {
        setError(`Error al actualizar el caso: ${caseUpdateError.message}`)
        setLoading(false)
        return
      }

      if (detailId) {
        const { error: detailUpdateError } = await supabase.from('case_details').update(detailPayload).eq('id', detailId)
        if (detailUpdateError) {
          setError(`Error al guardar los detalles: ${detailUpdateError.message}`)
          setLoading(false)
          return
        }
      } else {
        const { error: detailInsertError } = await supabase.from('case_details').insert({ case_id: caseId, ...detailPayload })
        if (detailInsertError) {
          setError(`Error al guardar los detalles: ${detailInsertError.message}`)
          setLoading(false)
          return
        }
      }

      await supabase.from('training_sessions').delete().eq('case_id', caseId)
      if (validTrainings.length > 0) {
        await supabase.from('training_sessions').insert(
          validTrainings.map((t) => ({ case_id: caseId, session_date: t.date, pickup_time: t.pickup_time || null, end_time: t.end_time || null }))
        )
      }

      router.push(`/cases/${caseId}`)
      router.refresh()
      return
    }

    const { data: newCase, error: caseError } = await supabase
      .from('cases')
      .insert({ family_name: form.family_name.trim(), created_by: userId, assigned_to: assignedTo || null })
      .select()
      .single()

    if (caseError || !newCase) {
      setError('Error al crear el caso. Intenta de nuevo.')
      setLoading(false)
      return
    }

    await supabase.from('case_details').insert({ case_id: newCase.id, ...detailPayload })

    if (validTrainings.length > 0) {
      await supabase.from('training_sessions').insert(
        validTrainings.map((t) => ({ case_id: newCase.id, session_date: t.date, pickup_time: t.pickup_time || null, end_time: t.end_time || null }))
      )
    }

    router.push(`/cases/${newCase.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Family */}
      <Card>
        <CardHeader>
          <SectionTitle icon={Users} title="Información de la Familia" />
        </CardHeader>
        <CardBody className="space-y-4">
          {employees && employees.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#0f1e35]">Asignar a empleada</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full border border-[#dde3f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1e35] bg-white focus:outline-none focus:ring-2 focus:ring-navy/30"
              >
                <option value="">Sin asignar</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.full_name ?? e.email}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Nombre del Hijo/a"
              placeholder="Nombre completo"
              value={form.son_name}
              onChange={(e) => set('son_name', e.target.value)}
            />
            <Input
              label="Nombre del Padre *"
              placeholder="Nombre completo"
              value={form.father_name}
              onChange={(e) => {
                set('father_name', e.target.value)
                const lastName = e.target.value.trim().split(' ').pop() ?? ''
                set('family_name', lastName)
              }}
            />
            <Input
              label="Nombre de la Madre"
              placeholder="Nombre completo"
              value={form.mother_name}
              onChange={(e) => set('mother_name', e.target.value)}
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
              placeholder="Ej: AV9475"
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
              placeholder="Ej: BGA"
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
              placeholder="Ej: BOG"
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
              placeholder="Ej: AV4804"
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
              placeholder="Ej: BOG"
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
              placeholder="Ej: BGA"
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
            placeholder="Ej: Hotel Radel"
            value={form.hotel_name}
            onChange={(e) => set('hotel_name', e.target.value)}
          />
          <Input
            label="Dirección"
            placeholder="Ej: Calle 24a # 44a - 65"
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
          {form.training_dates.map((training, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  type="date"
                  label={index === 0 ? 'Fecha' : undefined}
                  value={training.date}
                  onChange={(e) => setTrainingField(index, 'date', e.target.value)}
                />
                <Input
                  type="time"
                  label={index === 0 ? 'Hora de recogida' : undefined}
                  value={training.pickup_time}
                  onChange={(e) => setTrainingField(index, 'pickup_time', e.target.value)}
                />
                <Input
                  type="time"
                  label={index === 0 ? 'Hora de finalización' : undefined}
                  value={training.end_time}
                  onChange={(e) => setTrainingField(index, 'end_time', e.target.value)}
                />
              </div>
              {form.training_dates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTrainingDate(index)}
                  className="p-2 mt-6 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Trainer & Embassy */}
      <Card>
        <CardHeader>
          <SectionTitle icon={Users} title="Equipo de Acompañamiento" />
        </CardHeader>
        <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre del Entrenador"
            placeholder="Nombre completo"
            value={form.trainer_name}
            onChange={(e) => set('trainer_name', e.target.value)}
          />
          <Input
            label="Acompañamiento a la Embajada"
            placeholder="Nombre completo"
            value={form.embassy_companion}
            onChange={(e) => set('embassy_companion', e.target.value)}
          />
        </CardBody>
      </Card>

      {/* Comments */}
      <Card>
        <CardHeader>
          <SectionTitle icon={MessageSquare} title="Comentarios" />
        </CardHeader>
        <CardBody>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#0f1e35]">Comentarios adicionales</label>
            <textarea
              rows={4}
              placeholder="Información adicional, observaciones o notas importantes para la familia..."
              value={form.comments}
              onChange={(e) => set('comments', e.target.value)}
              className="w-full border border-[#dde3f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1e35] bg-white focus:outline-none focus:ring-2 focus:ring-navy/30 resize-none"
            />
          </div>
        </CardBody>
      </Card>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3 justify-end pb-8">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" variant="secondary" loading={loading}>
          {isEdit ? 'Guardar Cambios' : 'Crear Caso'}
        </Button>
      </div>
    </form>
  )
}
