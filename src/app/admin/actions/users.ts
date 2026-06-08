'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('No autorizado')
  return supabase
}

export async function approveUser(userId: string) {
  const supabase = await requireAdmin()
  await supabase.from('profiles').update({ approved: true }).eq('id', userId)
  revalidatePath('/admin')
}

export async function revokeUser(userId: string) {
  const supabase = await requireAdmin()
  await supabase.from('profiles').update({ approved: false }).eq('id', userId)
  revalidatePath('/admin')
}

export async function changeRole(userId: string, role: 'admin' | 'employee') {
  const supabase = await requireAdmin()
  await supabase.from('profiles').update({ role }).eq('id', userId)
  revalidatePath('/admin')
}
