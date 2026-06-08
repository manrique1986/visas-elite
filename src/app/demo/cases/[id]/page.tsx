import { notFound } from 'next/navigation'
import { DemoSidebar } from '@/components/layout/demo-sidebar'
import { DemoCaseDetailClient } from '@/components/cases/demo-case-detail-client'
import { DEMO_CASES } from '@/lib/demo-data'

export default async function DemoCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const caseData = DEMO_CASES.find(c => c.id === id)
  if (!caseData) notFound()

  return (
    <div className="flex min-h-screen">
      <DemoSidebar />
      <main className="flex-1 lg:ml-60 pt-16 lg:pt-0">
        <DemoCaseDetailClient staticCase={caseData} />
      </main>
    </div>
  )
}
