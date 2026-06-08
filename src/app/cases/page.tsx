import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { CasesListClient } from '@/components/cases/cases-list-client'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Case, Profile } from '@/lib/types'

export default async function CasesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile?.approved) redirect('/pending')

  const query = supabase
    .from('cases')
    .select('*')
    .order('updated_at', { ascending: false })

  if (profile?.role !== 'admin') {
    query.eq('assigned_to', user.id)
  }

  const { data: cases } = await query

  return (
    <div className="flex min-h-screen">
      <Sidebar profile={profile as Profile} />
      <main className="flex-1 lg:ml-60 pt-16 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#0f1e35]">Casos</h1>
              <p className="text-[#6b7a99] text-sm mt-0.5">
                {cases?.length ?? 0} caso{cases?.length !== 1 ? 's' : ''} en total
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

          <CasesListClient cases={(cases ?? []) as Case[]} />
        </div>
      </main>
    </div>
  )
}
