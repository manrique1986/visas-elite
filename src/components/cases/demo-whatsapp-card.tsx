'use client'
import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import type { DemoCase } from '@/lib/demo-data'
import { formatDateLong } from '@/lib/utils'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
      <span style={{ color: '#c9a030', fontSize: '13px', minWidth: '145px', fontWeight: 600, flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#ffffff', fontSize: '13px', lineHeight: '1.4' }}>{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{
        color: '#c9a030', fontSize: '10px', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '2px',
        marginBottom: '8px', paddingBottom: '5px',
        borderBottom: '1px solid rgba(201,160,48,0.35)',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export function DemoWhatsAppCard({ caseData }: { caseData: DemoCase }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const d = caseData.detail

  async function handleDownload() {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `Familia-${caseData.family_name}-VisasElite.png`
      a.click()
      setDownloaded(true)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div>
      {/* Preview label */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-px bg-[#dde3f0]" />
        <span className="text-xs text-[#6b7a99] font-medium px-2">Vista previa</span>
        <div className="flex-1 h-px bg-[#dde3f0]" />
      </div>

      {/* Card */}
      <div className="flex justify-center mb-6 overflow-x-auto pb-2">
        <div
          ref={cardRef}
          style={{
            width: '500px',
            flexShrink: 0,
            background: 'linear-gradient(155deg, #0a1628 0%, #0f2447 45%, #162d57 75%, #1a3a6b 100%)',
            borderRadius: '18px',
            padding: '30px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            boxShadow: '0 25px 70px rgba(0,0,0,0.45)',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center',
            marginBottom: '20px', paddingBottom: '16px',
            borderBottom: '1px solid rgba(201,160,48,0.4)',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ width: '145px', height: '56px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/logo.png"
                  alt="Visas Elite"
                  crossOrigin="anonymous"
                  style={{ width: '145px', height: 'auto', display: 'block', marginTop: '-92px' }}
                />
              </div>
             
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Familia
              </div>
              <div style={{ color: '#ffffff', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.3px' }}>
                {caseData.family_name}
              </div>
            </div>
          </div>

          {/* Integrantes */}
          <Section title="Integrantes">
            <Row label="Hijo:" value={d.son_name ?? ''} />
            <Row label="Papá:" value={d.father_name ?? ''} />
          </Section>

          {/* Citas */}
          <Section title="Citas">
            <Row label="Cita CAS:" value="30 de mayo a las 09:30" />
            <Row label="Cita Consular:" value="04 de junio a las 10:45" />
          </Section>

          {/* Vuelo llegada */}
          <Section title="Vuelo de Llegada">
            <Row label="Vuelo:" value={d.arrival_flight_code ?? ''} />
            <Row label="Ruta:" value={`${d.arrival_origin} ${d.arrival_departure_time} → ${d.arrival_destination} ${d.arrival_arrival_time}`} />
            <Row label="Fecha:" value={formatDateLong(d.arrival_date)} />
          </Section>

          {/* Vuelo salida */}
          <Section title="Vuelo de Salida">
            <Row label="Vuelo:" value={d.departure_flight_code ?? ''} />
            <Row label="Ruta:" value={`${d.departure_origin} ${d.departure_departure_time} → ${d.departure_destination} ${d.departure_arrival_time}`} />
            <Row label="Fecha:" value={formatDateLong(d.departure_date)} />
          </Section>

          {/* Hospedaje */}
          <Section title="Hospedaje">
            <Row label="Hotel:" value={d.hotel_name ?? ''} />
            <Row label="Dirección:" value={d.hotel_address ?? ''} />
            <Row label="Check-in:" value={formatDateLong(d.checkin_date)} />
            <Row label="Check-out:" value={formatDateLong(d.checkout_date)} />
          </Section>

          {/* Entrenamientos */}
          <Section title="Entrenamientos Presenciales">
            {caseData.training_sessions.map((t, i) => (
              <Row key={i} label={`Sesión ${i + 1}:`} value={formatDateLong(t.session_date)} />
            ))}
          </Section>

          {/* Footer */}
          <div style={{
            marginTop: '18px', paddingTop: '14px',
            borderTop: '1px solid rgba(201,160,48,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', letterSpacing: '0.5px' }}>
              
            </div>
            <div style={{ color: 'rgba(201,160,48,0.6)', fontSize: '10px', fontWeight: 700 }}>
              VISAS ELITE 2026
            </div>
          </div>
        </div>
      </div>

      {/* Download button */}
      <div className="flex flex-col items-center gap-3">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleDownload}
          loading={downloading}
          className="px-8 shadow-lg"
        >
          <Download className="w-4 h-4" />
          {downloaded ? '¡Imagen descargada!' : 'Descargar imagen PNG'}
        </Button>
        {downloaded ? (
          <p className="text-sm text-emerald-600 font-medium">
            ✓ Lista para pegar en el grupo de WhatsApp
          </p>
        ) : (
          <p className="text-xs text-[#6b7a99]">
            Se descarga en alta calidad · Lista para compartir en WhatsApp
          </p>
        )}
      </div>
    </div>
  )
}
