import Link from 'next/link'
import Image from 'next/image'
import { Users, ShieldCheck, ArrowRight, Star } from 'lucide-react'

export default function DemoEntryPage() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#0f2447] via-[#1a3a6b] to-[#0f2447] flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div style={{ position: 'relative', width: '165px', height: '95px', overflow: 'hidden' }}>
            <Image
              src="/logo.png"
              alt="Visas Elite"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 52%' }}
            />
          </div>
        </div>
        <p className="text-white/60 text-sm">Sistema de Gestión de Casos</p>
        <div className="inline-flex items-center gap-1.5 mt-2 bg-[#c9a030]/20 text-[#c9a030] text-xs font-semibold px-3 py-1 rounded-full border border-[#c9a030]/30">
          <Star className="w-3 h-3" />
          MODO DEMO
        </div>
      </div>

      {/* Cards */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-4">
        {/* Employee view */}
        <Link
          href="/demo/cases"
          className="group bg-white rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
        >
          <div className="w-10 h-10 bg-[#0f2447]/10 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-[#0f2447]" />
          </div>
          <h2 className="text-base font-bold text-[#0f1e35] mb-1.5">Vista Empleado</h2>
          <p className="text-[#6b7a99] text-sm leading-relaxed mb-4">
            Creación de casos, carga de datos, generación de imagen para WhatsApp y notas.
          </p>
          <div className="flex items-center gap-2 text-[#0f2447] text-sm font-semibold group-hover:gap-3 transition-all">
            Entrar como María López
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Admin view */}
        <Link
          href="/demo/admin"
          className="group bg-[#0f2447] rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
        >
          <div className="w-10 h-10 bg-[#c9a030]/20 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5 text-[#c9a030]" />
          </div>
          <h2 className="text-base font-bold text-white mb-1.5">Vista Catalina</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            Panel administrador: todos los casos, el equipo, próximas reuniones y métricas.
          </p>
          <div className="flex items-center gap-2 text-[#c9a030] text-sm font-semibold group-hover:gap-3 transition-all">
            Entrar como Administrador
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      <p className="text-white/25 text-xs text-center mt-5 max-w-sm leading-relaxed">
        Demostración con datos reales de ejemplo — Familia Guzman
      </p>
    </div>
  )
}
