import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { Clock } from 'lucide-react'

export default async function PendingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.approved) redirect('/')

  async function handleSignOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2447] via-[#1a3a6b] to-[#0f2447] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#0f2447] to-[#1a3a6b] px-8 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div style={{ position: 'relative', width: '170px', height: '98px', overflow: 'hidden' }}>
                <Image src="/logo.png" alt="Visas Elite" fill style={{ objectFit: 'cover', objectPosition: 'center 52%' }} />
              </div>
            </div>
          </div>
          <div className="px-8 py-8 text-center">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7 text-amber-500" />
            </div>
            <h2 className="text-[#0f1e35] text-lg font-semibold mb-2">Acceso pendiente</h2>
            <p className="text-[#6b7a99] text-sm leading-relaxed mb-6">
              Tu cuenta está esperando aprobación del administrador. Te avisarán cuando tengas acceso al sistema.
            </p>
            <p className="text-xs text-[#6b7a99] mb-6">
              Cuenta: <span className="font-medium text-[#0f1e35]">{profile?.email}</span>
            </p>
            <form action={handleSignOut}>
              <button
                type="submit"
                className="text-sm text-[#6b7a99] hover:text-[#0f1e35] underline underline-offset-2"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
