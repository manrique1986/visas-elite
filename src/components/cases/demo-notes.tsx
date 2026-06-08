'use client'
import { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { MessageSquare, Send } from 'lucide-react'

interface Note {
  id: string
  author: string
  initials: string
  content: string
  date: string
}

export function DemoNotes({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [content, setContent] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    const newNote: Note = {
      id: `demo-${Date.now()}`,
      author: 'María López',
      initials: 'ML',
      content: content.trim(),
      date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    }
    setNotes([newNote, ...notes])
    setContent('')
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-[#0f2447]" />
        <p className="text-sm font-semibold text-[#0f1e35]">Notas ({notes.length})</p>
      </CardHeader>
      <CardBody className="space-y-4">
        <form onSubmit={handleAdd} className="space-y-2">
          <Textarea
            placeholder="Agregar nota o comentario..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={!content.trim()}>
              <Send className="w-3.5 h-3.5" />
              Agregar
            </Button>
          </div>
        </form>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="bg-[#f4f6fb] rounded-lg px-3 py-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-[#0f2447]/20 flex items-center justify-center text-xs font-bold text-[#0f2447] shrink-0">
                  {note.initials}
                </div>
                <span className="text-xs font-semibold text-[#0f1e35]">{note.author}</span>
                <span className="text-xs text-[#6b7a99] ml-auto">{note.date}</span>
              </div>
              <p className="text-sm text-[#0f1e35] leading-relaxed">{note.content}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
