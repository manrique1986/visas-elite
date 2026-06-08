import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { CaseStatus } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null, fmt = 'dd/MM/yyyy') {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), fmt, { locale: es })
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr: string | null) {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), "dd 'de' MMMM 'a las' HH:mm", { locale: es })
  } catch {
    return dateStr
  }
}

export function formatDateLong(dateStr: string | null) {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), "dd 'de' MMMM", { locale: es })
  } catch {
    return dateStr
  }
}

export const statusConfig: Record<CaseStatus, { label: string; color: string; bg: string }> = {
  en_proceso: { label: 'En Proceso', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  aprobada: { label: 'Aprobada', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  negada: { label: 'Negada', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
}
