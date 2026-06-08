import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { CaseForm } from '@/components/cases/case-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Profile, CaseFormData } from '@/lib/types'

export default async function CaseEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const { data: caseData } = await supabase
    .from('cases')
    .select('*, case_details(*), training_sessions(*)')
    .eq('id', id)
    .single()

  if (!caseData) notFound()

  const detail = caseData.case_details?.[0]
  const trainings: { session_date: string }[] = caseData.training_sessions ?? []

  function toDatetimeLocal(val: string | null | undefined) {
    if (!val) return ''
    return val.substring(0, 16)
  }

  const initialValues: CaseFormData = {
    family_name: caseData.family_name ?? '',
    son_name: detail?.son_name ?? '',
    father_name: detail?.father_name ?? '',
    cas_appointment: toDatetimeLocal(detail?.cas_appointment),
    consular_appointment: toDatetimeLocal(detail?.consular_appointment),
    arrival_flight_code: detail?.arrival_flight_code ?? '',
    arrival_origin: detail?.arrival_origin ?? '',
    arrival_departure_time: detail?.arrival_departure_time ?? '',
    arrival_destination: detail?.arrival_destination ?? '',
    arrival_arrival_time: detail?.arrival_arrival_time ?? '',
    arrival_date: (detail as Record<string, unknown>)?.arrival_date as string ?? '',
    departure_flight_code: detail?.departure_flight_code ?? '',
    departure_origin: detail?.departure_origin ?? '',
    departure_departure_time: detail?.departure_departure_time ?? '',
    departure_destination: detail?.departure_destination ?? '',
    departure_arrival_time: detail?.departure_arrival_time ?? '',
    departure_date: (detail as Record<string, unknown>)?.departure_date as string ?? '',
    hotel_name: detail?.hotel_name ?? '',
    hotel_address: detail?.hotel_address ?? '',
    checkin_date: detail?.checkin_date ?? '',
    checkout_date: detail?.checkout_date ?? '',
    training_dates: trainings.map(t => t.session_date),
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar profile={profile as Profile} />
      <main className="flex-1 lg:ml-60 pt-16 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <Link
              href={`/cases/${id}`}
              className="inline-flex items-center gap-1 text-sm text-[#6b7a99] hover:text-[#0f1e35] mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Familia {caseData.family_name}
            </Link>
            <h1 className="text-2xl font-bold text-[#0f1e35]">Editar Caso</h1>
            <p className="text-[#6b7a99] text-sm mt-0.5">Familia {caseData.family_name}</p>
          </div>
          <CaseForm
            userId={user.id}
            caseId={id}
            detailId={detail?.id}
            initialValues={initialValues}
          />
        </div>
      </main>
    </div>
  )
}
