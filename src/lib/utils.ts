import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { CaseStatus } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function stripTz(dateStr: string) {
  // Remove timezone offset to treat the timestamp as-is (no UTC conversion)
  return dateStr.substring(0, 19)
}

export function formatDate(dateStr: string | null, fmt = 'dd/MM/yyyy') {
  if (!dateStr) return '—'
  try {
    return format(parseISO(stripTz(dateStr)), fmt, { locale: es })
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr: string | null) {
  if (!dateStr) return '—'
  try {
    return format(parseISO(stripTz(dateStr)), "dd 'de' MMMM 'a las' HH:mm", { locale: es })
  } catch {
    return dateStr
  }
}

export function formatDateLong(dateStr: string | null) {
  if (!dateStr) return '—'
  try {
    return format(parseISO(stripTz(dateStr)), "dd 'de' MMMM", { locale: es })
  } catch {
    return dateStr
  }
}

export function formatDateWithDay(dateStr: string | null) {
  if (!dateStr) return '—'
  try {
    const str = format(parseISO(stripTz(dateStr)), "EEEE d 'de' MMMM", { locale: es })
    return str.charAt(0).toUpperCase() + str.slice(1)
  } catch {
    return dateStr
  }
}

export function formatTime12h(dateStr: string | null) {
  if (!dateStr) return '—'
  try {
    const d = parseISO(stripTz(dateStr))
    const h = d.getHours()
    const m = d.getMinutes()
    const period = h < 12 ? 'a.m.' : 'p.m.'
    const h12 = h % 12 || 12
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`
  } catch {
    return dateStr
  }
}

export function formatTimeStr(timeStr: string | null) {
  if (!timeStr) return null
  try {
    const [h, m] = timeStr.split(':').map(Number)
    const period = h < 12 ? 'a.m.' : 'p.m.'
    const h12 = h % 12 || 12
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`
  } catch {
    return timeStr
  }
}

export const statusConfig: Record<CaseStatus, { label: string; color: string; bg: string }> = {
  en_proceso: { label: 'En Proceso', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  aprobada: { label: 'Aprobada', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  negada: { label: 'Negada', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
}
