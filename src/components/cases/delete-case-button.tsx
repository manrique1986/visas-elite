'use client'
import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteCase } from '@/app/cases/actions'

export function DeleteCaseButton({ caseId }: { caseId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(() => deleteCase(caseId))
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600 font-medium">¿Eliminar caso?</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-3 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Eliminando...' : 'Confirmar'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          disabled={isPending}
          className="px-3 py-1.5 bg-white border border-[#dde3f0] text-[#0f1e35] text-sm font-semibold rounded-lg hover:bg-[#f4f6fb] transition-colors"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="inline-flex items-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
    >
      <Trash2 className="w-4 h-4" />
      <span className="hidden sm:inline">Eliminar</span>
    </button>
  )
}
