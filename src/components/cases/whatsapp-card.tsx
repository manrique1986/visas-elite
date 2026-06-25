'use client'
import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { formatDateLong, formatDateWithDay, formatTime12h, formatTimeStr } from '@/lib/utils'

interface WhatsAppCardProps {
  caseData: {
    family_name: string
    case_details: {
      son_name: string | null
      father_name: string | null
      mother_name: string | null
      cas_appointment: string | null
      consular_appointment: string | null
      arrival_flight_code: string | null
      arrival_origin: string | null
      arrival_departure_time: string | null
      arrival_destination: string | null
      arrival_arrival_time: string | null
      arrival_date: string | null
      departure_flight_code: string | null
      departure_origin: string | null
      departure_departure_time: string | null
      departure_destination: string | null
      departure_arrival_time: string | null
      departure_date: string | null
      hotel_name: string | null
      hotel_address: string | null
      checkin_date: string | null
      checkout_date: string | null
      trainer_name: string | null
      embassy_companion: string | null
      comments: string | null
    }[]
    training_sessions: { session_date: string; pickup_time: string | null; end_time: string | null }[]
  }
}

function Row({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
      <span style={{ color: '#c9a030', fontSize: '13px', minWidth: '140px', fontWeight: 600 }}>{label}</span>
      <span style={{ color: '#ffffff', fontSize: '13px' }}>{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        color: '#c9a030',
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom: '8px',
        paddingBottom: '4px',
        borderBottom: '1px solid rgba(201,160,48,0.3)',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export function WhatsAppCard({ caseData }: WhatsAppCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const detail = caseData.case_details?.[0]
  const trainings = caseData.training_sessions ?? []

  async function handleDownload() {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `Familia-${caseData.family_name}-VisasElite.png`
      a.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div>
      {/* Preview */}
      <div className="flex justify-center mb-6 overflow-auto">
        <div
          ref={cardRef}
          style={{
            width: '480px',
            background: 'linear-gradient(160deg, #0a1628 0%, #0f2447 50%, #1a3a6b 100%)',
            borderRadius: '16px',
            padding: '28px',
            fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Logo header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(201,160,48,0.3)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ width: '145px', height: '85px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/logo.png"
                  alt="Visas Elite"
                  crossOrigin="anonymous"
                  style={{ width: '145px', height: 'auto', display: 'block', marginTop: '-91px' }}
                />
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '4px', letterSpacing: '0.3px' }}>
               
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {detail?.father_name && (
                <div style={{ marginBottom: '2px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Papá </span>
                  <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700 }}>{detail.father_name}</span>
                </div>
              )}
              {detail?.mother_name && (
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mamá </span>
                  <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700 }}>{detail.mother_name}</span>
                </div>
              )}
              {!detail?.father_name && !detail?.mother_name && (
                <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: 800 }}>{caseData.family_name}</div>
              )}
            </div>
          </div>

          {/* Members */}
          {(detail?.son_name || detail?.father_name || detail?.mother_name) && (
            <Section title="Integrantes">
              <Row label="Hijo/a:" value={detail?.son_name ?? null} />
              <Row label="Papá:" value={detail?.father_name ?? null} />
              <Row label="Mamá:" value={detail?.mother_name ?? null} />
            </Section>
          )}

          {/* CAS */}
          {detail?.cas_appointment && (
            <Section title="CAS – Toma de huellas y fotografía">
              <Row label="Fecha:" value={formatDateWithDay(detail.cas_appointment)} />
              <Row label="Hora:" value={formatTime12h(detail.cas_appointment)} />
              <Row label="Vestimenta:" value="Asistir con vestimenta normal." />
            </Section>
          )}

          {/* Consular */}
          {detail?.consular_appointment && (
            <Section title="Entrevista Consular">
              <Row label="Fecha:" value={formatDateWithDay(detail.consular_appointment)} />
              <Row label="Hora:" value={formatTime12h(detail.consular_appointment)} />
              <Row label="Vestimenta:" value="Asistir con la vestimenta sugerida previamente en el grupo." />
              <Row label="Acompañamiento:" value={detail.embassy_companion ?? null} />
            </Section>
          )}

          {/* Trainings */}
          {(trainings.length > 0 || detail?.trainer_name) && (
            <Section title="Entrenamientos Presenciales">
              {detail?.trainer_name && <Row label="Entrenador:" value={detail.trainer_name} />}
              {trainings.map((t, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ color: '#c9a030', fontSize: '13px', minWidth: '140px', fontWeight: 700 }}>{i === 0 ? 'Primer' : i === 1 ? 'Segundo' : i === 2 ? 'Tercer' : `${i + 1}°`} entrenamiento consular:</span>
                  </div>
                  <Row label="Fecha:" value={formatDateWithDay(t.session_date)} />
                  {t.pickup_time && <Row label="Hora de recogida:" value={formatTimeStr(t.pickup_time) ?? t.pickup_time} />}
                  {t.end_time && <Row label="Finalización:" value={formatTimeStr(t.end_time) ?? t.end_time} />}
                </div>
              ))}
            </Section>
          )}

          {/* Arrival */}
          {detail?.arrival_flight_code && (
            <Section title="Vuelo de Llegada">
              <Row label="Vuelo:" value={detail.arrival_flight_code} />
              <Row
                label="Ruta:"
                value={`${detail.arrival_origin ?? ''} ${detail.arrival_departure_time ?? ''} → ${detail.arrival_destination ?? ''} ${detail.arrival_arrival_time ?? ''}`}
              />
              {detail.arrival_date && <Row label="Fecha:" value={formatDateLong(detail.arrival_date)} />}
            </Section>
          )}

          {/* Departure */}
          {detail?.departure_flight_code && (
            <Section title="Vuelo de Salida">
              <Row label="Vuelo:" value={detail.departure_flight_code} />
              <Row
                label="Ruta:"
                value={`${detail.departure_origin ?? ''} ${detail.departure_departure_time ?? ''} → ${detail.departure_destination ?? ''} ${detail.departure_arrival_time ?? ''}`}
              />
              {detail.departure_date && <Row label="Fecha:" value={formatDateLong(detail.departure_date)} />}
            </Section>
          )}

          {/* Hotel */}
          {detail?.hotel_name && (
            <Section title="Hospedaje">
              <Row label="Hotel:" value={detail.hotel_name} />
              {detail.hotel_address && <Row label="Dirección:" value={detail.hotel_address} />}
              {detail.checkin_date && <Row label="Check-in:" value={formatDateLong(detail.checkin_date)} />}
              {detail.checkout_date && <Row label="Check-out:" value={formatDateLong(detail.checkout_date)} />}
            </Section>
          )}

          {/* Comments */}
          {detail?.comments && (
            <Section title="Comentarios">
              <div style={{ color: '#ffffff', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {detail.comments}
              </div>
            </Section>
          )}

          {/* Mensaje importante si no hay hotel */}
          {!detail?.hotel_name && (
            <div style={{
              marginBottom: '16px',
              padding: '10px 12px',
              background: 'rgba(201,160,48,0.12)',
              borderRadius: '8px',
              borderLeft: '3px solid #c9a030',
            }}>
              <div style={{ color: '#c9a030', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                Importante
              </div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', lineHeight: '1.5' }}>
                Quedamos atentos a que nos compartan la dirección de alojamiento en Bogotá para coordinar oportunamente las recogidas correspondientes.
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{
            marginTop: '20px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(201,160,48,0.3)',
            textAlign: 'center',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginBottom: '2px' }}>
              Muchas gracias.
            </div>
            <div style={{ color: '#c9a030', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px' }}>
              Equipo Visas Elite
            </div>
          </div>
        </div>
      </div>

      {/* Download button */}
      <div className="flex justify-center">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleDownload}
          loading={downloading}
          className="gap-2"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Descargar imagen PNG
        </Button>
      </div>

      <p className="text-center text-xs text-[#6b7a99] mt-3">
        La imagen se descarga lista para compartir en WhatsApp
      </p>
    </div>
  )
}
