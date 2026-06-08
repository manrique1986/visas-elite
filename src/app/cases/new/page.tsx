import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { CaseForm } from '@/components/cases/case-form'
import type { Profile } from '@/lib/types'

export default async function NewCasePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div className="flex min-h-screen">
      <Sidebar profile={profile as Profile} />
      <main className="flex-1 lg:ml-60 pt-16 lg:pt-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0f1e35]">Nuevo Caso</h1>
            <p className="text-[#6b7a99] text-sm mt-0.5">Completa la información de la familia</p>
          </div>
          <CaseForm userId={user.id} />
        </div>
      </main>
    </div>
  )
}
