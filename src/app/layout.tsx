import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Visas Elite — Gestión de Casos',
  description: 'Sistema interno de gestión de casos de visa americana',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Visas Elite — Gestión de Casos',
    description: 'Sistema interno de gestión de casos de visa americana',
    images: [{ url: '/icon.png' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full bg-[#f4f6fb]">{children}</body>
    </html>
  )
}
