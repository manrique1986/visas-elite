'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function deleteCase(caseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Solo los administradores pueden eliminar casos')

  await supabase.from('case_notes').delete().eq('case_id', caseId)
  await supabase.from('onboarding_meetings').delete().eq('case_id', caseId)
  await supabase.from('training_sessions').delete().eq('case_id', caseId)
  await supabase.from('case_details').delete().eq('case_id', caseId)
  await supabase.from('cases').delete().eq('id', caseId)

  redirect('/cases')
}
