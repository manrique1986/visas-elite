'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { FolderOpen, ShieldCheck, LogOut, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface DemoSidebarProps {
  isAdmin?: boolean
}

export function DemoSidebar({ isAdmin = false }: DemoSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const user = isAdmin
    ? { name: 'Catalina Cardozo', role: 'Administrador', initials: 'CC', color: '#c9a030' }
    : { name: 'María López', role: 'Empleado', initials: 'ML', color: '#0f2447' }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div style={{ position: 'relative', width: '130px', height: '75px', overflow: 'hidden' }}>
            <Image
              src="/logo.png"
              alt="Visas Elite"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 52%' }}
            />
          </div>
          <span className="text-[10px] font-bold text-[#c9a030] bg-[#c9a030]/15 px-1.5 py-0.5 rounded">DEMO</span>
        </div>
        <p className="text-white/50 text-xs">Gestión de Casos</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {[
          { href: '/demo/cases', label: 'Casos', icon: FolderOpen },
        ].map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}

        {isAdmin && (
          <>
            <div className="pt-3 pb-1 px-3">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-wider">Administración</p>
            </div>
            <Link
              href="/demo/admin"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === '/demo/admin' ? 'bg-[#c9a030]/20 text-[#c9a030]' : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Panel Admin
            </Link>
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: user.color }}
          >
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user.name}</p>
            <p className="text-white/40 text-xs">{user.role}</p>
          </div>
        </div>
        <Link
          href="/demo"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cambiar vista
        </Link>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-[#0f2447] fixed left-0 top-0 z-40">
        <NavContent />
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0f2447] flex items-center gap-3 px-4 py-3">
        <button onClick={() => setMobileOpen(true)} className="text-white p-1">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div style={{ position: 'relative', width: '90px', height: '52px', overflow: 'hidden' }}>
            <Image
              src="/logo.png"
              alt="Visas Elite"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 52%' }}
            />
          </div>
          <span className="text-[10px] font-bold text-[#c9a030] bg-[#c9a030]/15 px-1.5 py-0.5 rounded">DEMO</span>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex flex-col w-72 bg-[#0f2447] h-full">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  )
}
