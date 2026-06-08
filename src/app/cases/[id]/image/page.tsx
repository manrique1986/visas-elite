import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { WhatsAppCard } from '@/components/cases/whatsapp-card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Profile } from '@/lib/types'

export default async function ImagePage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div className="flex min-h-screen">
      <Sidebar profile={profile as Profile} />
      <main className="flex-1 lg:ml-60 pt-16 lg:pt-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <Link
              href={`/cases/${id}`}
              className="inline-flex items-center gap-1 text-sm text-[#6b7a99] hover:text-[#0f1e35] mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al caso
            </Link>
            <h1 className="text-2xl font-bold text-[#0f1e35]">Generar Imagen</h1>
            <p className="text-[#6b7a99] text-sm mt-0.5">
              Vista previa de la tarjeta para compartir en WhatsApp
            </p>
          </div>

          <WhatsAppCard caseData={caseData} />
        </div>
      </main>
    </div>
  )
}
