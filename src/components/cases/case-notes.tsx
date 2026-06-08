'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { MessageSquare, Send } from 'lucide-react'
import type { CaseNote, Profile } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface CaseNotesProps {
  caseId: string
  notes: (CaseNote & { profiles?: { full_name: string; avatar_url: string } })[]
  currentUserId: string
  currentProfile: Profile
}

export function CaseNotes({ caseId, notes: initialNotes, currentUserId, currentProfile }: CaseNotesProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const router = useRouter()

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSending(true)

    const supabase = createClient()
    const { data } = await supabase
      .from('case_notes')
      .insert({ case_id: caseId, author_id: currentUserId, content: content.trim() })
      .select('*, profiles(full_name, avatar_url)')
      .single()

    if (data) {
      setNotes((prev) => [data, ...prev])
      setContent('')
    }
    setSending(false)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-navy" />
        <p className="text-sm font-semibold text-[#0f1e35]">Notas ({notes.length})</p>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Add note */}
        <form onSubmit={handleAddNote} className="space-y-2">
          <Textarea
            placeholder="Agregar nota o comentario..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" variant="primary" loading={sending} disabled={!content.trim()}>
              <Send className="w-3.5 h-3.5" />
              Agregar
            </Button>
          </div>
        </form>

        {/* Notes list */}
        {notes.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
            {notes.map((note) => (
              <div key={note.id} className="bg-[#f4f6fb] rounded-lg px-3 py-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-navy/20 flex items-center justify-center text-xs font-bold text-navy shrink-0">
                    {(note.profiles?.full_name ?? 'U')[0]}
                  </div>
                  <span className="text-xs font-semibold text-[#0f1e35]">
                    {note.profiles?.full_name ?? 'Usuario'}
                  </span>
                  <span className="text-xs text-[#6b7a99] ml-auto">{formatDate(note.created_at)}</span>
                </div>
                <p className="text-sm text-[#0f1e35] leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#6b7a99] text-center py-4">Sin notas todavía</p>
        )}
      </CardBody>
    </Card>
  )
}
