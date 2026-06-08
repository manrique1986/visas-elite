import { DemoSidebar } from '@/components/layout/demo-sidebar'
import Link from 'next/link'
import { ArrowLeft, Info } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/card'

export default function DemoNewCasePage() {
  return (
    <div className="flex min-h-screen">
      <DemoSidebar />
      <main className="flex-1 lg:ml-60 pt-16 lg:pt-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <Link href="/demo/cases" className="inline-flex items-center gap-1 text-sm text-[#6b7a99] hover:text-[#0f1e35] mb-3">
              <ArrowLeft className="w-3.5 h-3.5" />
              Casos
            </Link>
            <h1 className="text-2xl font-bold text-[#0f1e35]">Nuevo Caso</h1>
            <p className="text-[#6b7a99] text-sm mt-0.5">Completa la información de la familia</p>
          </div>

          <Card>
            <CardBody className="py-12 text-center">
              <div className="w-12 h-12 bg-[#0f2447]/8 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Info className="w-6 h-6 text-[#0f2447]" />
              </div>
              <h3 className="font-semibold text-[#0f1e35] mb-2">Función disponible en la versión real</h3>
              <p className="text-[#6b7a99] text-sm max-w-sm mx-auto mb-6">
                En la app completa, aquí cargarías todos los datos de la familia: integrantes, vuelos, hotel, citas y entrenamientos.
              </p>
              <Link
                href="/demo/cases/guzman"
                className="inline-flex items-center gap-2 bg-[#0f2447] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1a3a6b] transition-colors"
              >
                Ver ejemplo: Familia Guzman →
              </Link>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  )
}
