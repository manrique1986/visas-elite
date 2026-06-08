import { notFound } from 'next/navigation'
import { DemoSidebar } from '@/components/layout/demo-sidebar'
import { DemoEditForm } from '@/components/cases/demo-edit-form'
import { DEMO_CASES } from '@/lib/demo-data'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function DemoCaseEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const caseData = DEMO_CASES.find(c => c.id === id)
  if (!caseData) notFound()

  return (
    <div className="flex min-h-screen">
      <DemoSidebar />
      <main className="flex-1 lg:ml-60 pt-16 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <Link
              href={`/demo/cases/${id}`}
              className="inline-flex items-center gap-1 text-sm text-[#6b7a99] hover:text-[#0f1e35] mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Familia {caseData.family_name}
            </Link>
            <h1 className="text-2xl font-bold text-[#0f1e35]">Editar Caso</h1>
            <p className="text-[#6b7a99] text-sm mt-0.5">Familia {caseData.family_name}</p>
          </div>
          <DemoEditForm caseData={caseData} />
        </div>
      </main>
    </div>
  )
}
