'use client'
import { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Video, Plus, X, ExternalLink } from 'lucide-react'

interface DemoMeeting {
  id: string
  scheduled_at: string
  meet_url: string | null
}

export function DemoMeetingScheduler() {
  const [meetings, setMeetings] = useState<DemoMeeting[]>([])
  const [showForm, setShowForm] = useState(false)
  const [scheduledAt, setScheduledAt] = useState('')
  const [meetUrl, setMeetUrl] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!scheduledAt) return
    const newMeeting: DemoMeeting = {
      id: `demo-${Date.now()}`,
      scheduled_at: scheduledAt,
      meet_url: meetUrl.trim() || null,
    }
    setMeetings((prev) =>
      [...prev, newMeeting].sort(
        (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
      )
    )
    setScheduledAt('')
    setMeetUrl('')
    setShowForm(false)
  }

  function handleDelete(id: string) {
    setMeetings((prev) => prev.filter((m) => m.id !== id))
  }

  function formatDT(val: string) {
    const d = new Date(val)
    return d.toLocaleString('es-CO', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-navy" />
          <p className="text-sm font-semibold text-[#0f1e35]">Reuniones Meet ({meetings.length})</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 text-xs text-navy hover:text-[#0f1e35] font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Agendar
          </button>
        )}
      </CardHeader>
      <CardBody className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3 bg-[#f4f6fb] rounded-lg p-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#6b7a99]">Fecha y hora *</label>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#6b7a99]">Link de Meet (opcional)</label>
              <Input
                type="url"
                placeholder="https://meet.google.com/..."
                value={meetUrl}
                onChange={(e) => setMeetUrl(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => { setShowForm(false); setScheduledAt(''); setMeetUrl('') }}
              >
                <X className="w-3.5 h-3.5" />
                Cancelar
              </Button>
              <Button type="submit" size="sm" variant="primary" disabled={!scheduledAt}>
                <Plus className="w-3.5 h-3.5" />
                Guardar
              </Button>
            </div>
          </form>
        )}

        {meetings.length > 0 ? (
          <div className="space-y-2">
            {meetings.map((m) => (
              <div key={m.id} className="flex items-start justify-between gap-2 bg-[#f4f6fb] rounded-lg px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0f1e35]">{formatDT(m.scheduled_at)}</p>
                  {m.meet_url && (
                    <a
                      href={m.meet_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-navy hover:underline mt-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Unirse al Meet
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="text-[#6b7a99] hover:text-red-500 shrink-0 mt-0.5"
                  aria-label="Eliminar reunión"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          !showForm && (
            <p className="text-xs text-[#6b7a99] text-center py-4">Sin reuniones agendadas</p>
          )
        )}
      </CardBody>
    </Card>
  )
}
