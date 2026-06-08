import Link from 'next/link'

// Página de preview estática — solo para demo visual, no requiere auth
export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] font-sans">
      {/* Nav */}
      <div className="bg-white border-b border-[#dde3f0] px-6 py-3 flex items-center gap-3">
        <div className="w-7 h-7 bg-[#c9a030] rounded-lg flex items-center justify-center text-white text-sm">🌐</div>
        <span className="font-bold text-[#0f2447]">Visas Elite — Preview de Diseño</span>
        <div className="ml-auto flex gap-2 text-xs">
          <a href="#dashboard" className="text-[#6b7a99] hover:text-[#0f2447]">Dashboard</a>
          <a href="#caso" className="text-[#6b7a99] hover:text-[#0f2447]">Caso</a>
          <a href="#imagen" className="text-[#6b7a99] hover:text-[#0f2447]">Imagen</a>
          <a href="#admin" className="text-[#6b7a99] hover:text-[#0f2447]">Admin</a>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 min-h-screen bg-[#0f2447] flex flex-col">
          <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
            <div className="w-8 h-8 bg-[#c9a030] rounded-lg flex items-center justify-center text-white">🌐</div>
            <div>
              <p className="text-white font-bold text-sm">Visas Elite</p>
              <p className="text-white/50 text-xs">Gestión de Casos</p>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {['Dashboard', 'Casos'].map((item, i) => (
              <div key={item} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${i === 0 ? 'bg-white/15 text-white' : 'text-white/60'}`}>
                <span>{i === 0 ? '📊' : '📁'}</span>
                {item}
              </div>
            ))}
            <div className="pt-3 pb-1 px-3">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-wider">Administración</p>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60">
              <span>🛡️</span> Panel Admin
            </div>
          </nav>
          <div className="px-3 py-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-[#c9a030] flex items-center justify-center text-white text-sm font-bold">C</div>
              <div>
                <p className="text-white text-sm font-medium">Catalina C.</p>
                <p className="text-white/40 text-xs">Administrador</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-8 py-8 space-y-16">

          {/* ===== DASHBOARD ===== */}
          <section id="dashboard">
            <p className="text-xs font-bold text-[#6b7a99] uppercase tracking-widest mb-4">Vista 1 — Dashboard</p>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#0f1e35]">Dashboard</h1>
                <p className="text-[#6b7a99] text-sm">Bienvenido, Catalina</p>
              </div>
              <button className="inline-flex items-center gap-2 bg-[#0f2447] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                + Nuevo Caso
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Casos', value: '24', icon: '📁', color: 'text-[#0f2447]', bg: 'bg-[#0f2447]/8' },
                { label: 'En Proceso', value: '12', icon: '⏳', color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Aprobadas', value: '9', icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Negadas', value: '3', icon: '❌', color: 'text-red-500', bg: 'bg-red-50' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl border border-[#dde3f0] shadow-sm px-5 py-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center text-lg`}>{s.icon}</div>
                  <div>
                    <p className="text-2xl font-bold text-[#0f1e35]">{s.value}</p>
                    <p className="text-xs text-[#6b7a99]">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cases list */}
            <div className="bg-white rounded-xl border border-[#dde3f0] shadow-sm">
              {[
                { name: 'Guzman', status: 'en_proceso', date: '07/06/2025', employee: 'María L.' },
                { name: 'Rodríguez', status: 'aprobada', date: '05/06/2025', employee: 'Carlos R.' },
                { name: 'Martínez', status: 'negada', date: '03/06/2025', employee: 'Ana S.' },
                { name: 'Pérez', status: 'en_proceso', date: '01/06/2025', employee: 'María L.' },
              ].map((c, i) => (
                <div key={i} className={`flex items-center justify-between px-6 py-4 ${i < 3 ? 'border-b border-[#dde3f0]' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#0f2447]/8 rounded-lg flex items-center justify-center font-bold text-[#0f2447]">{c.name[0]}</div>
                    <div>
                      <p className="font-semibold text-[#0f1e35] text-sm">Familia {c.name}</p>
                      <p className="text-xs text-[#6b7a99]">{c.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      c.status === 'en_proceso' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      c.status === 'aprobada' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {c.status === 'en_proceso' ? 'En Proceso' : c.status === 'aprobada' ? 'Aprobada' : 'Negada'}
                    </span>
                    <span className="text-[#6b7a99]">›</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== DETALLE DEL CASO ===== */}
          <section id="caso">
            <p className="text-xs font-bold text-[#6b7a99] uppercase tracking-widest mb-4">Vista 2 — Detalle del Caso</p>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-[#6b7a99]">← Casos</span>
              <h1 className="text-2xl font-bold text-[#0f1e35]">Familia Guzman</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200">En Proceso</span>
              <div className="ml-auto">
                <button className="inline-flex items-center gap-2 bg-[#c9a030] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  📥 Generar Imagen
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                {/* Estado */}
                <div className="bg-white rounded-xl border border-[#dde3f0] shadow-sm">
                  <div className="px-6 py-3 border-b border-[#dde3f0] text-sm font-semibold text-[#0f1e35]">Estado del Caso</div>
                  <div className="px-6 py-4 flex gap-2">
                    {['En Proceso', 'Aprobada', 'Negada'].map((s, i) => (
                      <button key={s} className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${i === 0 ? 'bg-amber-50 text-amber-700 border-amber-200 ring-2 ring-amber-400 ring-offset-1' : 'border-[#dde3f0] text-[#6b7a99]'}`}>{s}</button>
                    ))}
                  </div>
                </div>

                {/* Citas */}
                <div className="bg-white rounded-xl border border-[#dde3f0] shadow-sm">
                  <div className="px-6 py-3 border-b border-[#dde3f0] flex items-center gap-2 text-sm font-semibold text-[#0f1e35]"><span>📅</span> Citas</div>
                  <div className="px-6 py-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-[#6b7a99]">Cita CAS:</span><span className="font-medium">30 de mayo a las 09:30</span></div>
                    <div className="flex justify-between"><span className="text-[#6b7a99]">Cita Consular:</span><span className="font-medium">04 de junio a las 10:45</span></div>
                  </div>
                </div>

                {/* Vuelos */}
                <div className="bg-white rounded-xl border border-[#dde3f0] shadow-sm">
                  <div className="px-6 py-3 border-b border-[#dde3f0] flex items-center gap-2 text-sm font-semibold text-[#0f1e35]"><span>✈️</span> Vuelos</div>
                  <div className="px-6 py-4 space-y-3 text-sm">
                    <div>
                      <p className="text-xs text-[#6b7a99] font-semibold uppercase tracking-wide mb-1">Llegada</p>
                      <p className="font-semibold text-[#0f1e35]">AV9475</p>
                      <p className="text-[#6b7a99]">BGA 05:55 → BOG 07:00 · 30 de mayo</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6b7a99] font-semibold uppercase tracking-wide mb-1">Salida</p>
                      <p className="font-semibold text-[#0f1e35]">AV4804</p>
                      <p className="text-[#6b7a99]">BOG 17:10 → BGA 18:10 · 04 de junio</p>
                    </div>
                  </div>
                </div>

                {/* Hotel */}
                <div className="bg-white rounded-xl border border-[#dde3f0] shadow-sm">
                  <div className="px-6 py-3 border-b border-[#dde3f0] flex items-center gap-2 text-sm font-semibold text-[#0f1e35]"><span>🏨</span> Hospedaje</div>
                  <div className="px-6 py-4 space-y-1 text-sm">
                    <p className="font-semibold text-[#0f1e35]">Hoteles Radel</p>
                    <p className="text-[#6b7a99]">Calle 24a # 44a - 65</p>
                    <p className="text-[#6b7a99]">Check-in: 30/05 · Check-out: 04/06</p>
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <div className="bg-white rounded-xl border border-[#dde3f0] shadow-sm">
                  <div className="px-5 py-3 border-b border-[#dde3f0] flex items-center gap-2 text-sm font-semibold text-[#0f1e35]"><span>💬</span> Notas (2)</div>
                  <div className="px-5 py-4 space-y-4">
                    <textarea className="w-full px-3 py-2 text-sm rounded-lg border border-[#dde3f0] resize-none" rows={3} placeholder="Agregar nota..." />
                    <div className="space-y-3">
                      {[
                        { user: 'María L.', text: 'Documentos del padre listos para revisión.', date: '06/06' },
                        { user: 'Carlos R.', text: 'Cliente confirmó vuelos.', date: '05/06' },
                      ].map((n, i) => (
                        <div key={i} className="bg-[#f4f6fb] rounded-lg px-3 py-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-[#0f2447]/20 flex items-center justify-center text-xs font-bold text-[#0f2447]">{n.user[0]}</div>
                            <span className="text-xs font-semibold text-[#0f1e35]">{n.user}</span>
                            <span className="text-xs text-[#6b7a99] ml-auto">{n.date}</span>
                          </div>
                          <p className="text-sm text-[#0f1e35]">{n.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== IMAGEN WHATSAPP ===== */}
          <section id="imagen">
            <p className="text-xs font-bold text-[#6b7a99] uppercase tracking-widest mb-4">Vista 3 — Tarjeta para WhatsApp</p>
            <div className="flex flex-col items-center">
              {/* Card */}
              <div style={{
                width: '480px',
                background: 'linear-gradient(160deg, #0a1628 0%, #0f2447 50%, #1a3a6b 100%)',
                borderRadius: '16px',
                padding: '28px',
                fontFamily: 'system-ui, sans-serif',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(201,160,48,0.3)' }}>
                  <div style={{ width: '40px', height: '40px', background: '#c9a030', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '20px' }}>🌐</div>
                  <div>
                    <div style={{ color: '#c9a030', fontSize: '17px', fontWeight: 800 }}>VISAS ELITE</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Agencia La Sabana • Bogotá</div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase' }}>Familia</div>
                    <div style={{ color: '#fff', fontSize: '18px', fontWeight: 800 }}>Guzman</div>
                  </div>
                </div>

                {[
                  { title: 'INTEGRANTES', rows: [['Hijo:', 'Sebastián Enrique Guzman Oviedo'], ['Papá:', 'Adolfo Guzman Oviedo']] },
                  { title: 'CITAS', rows: [['Cita CAS:', '30 de mayo a las 09:30'], ['Cita Consular:', '04 de junio a las 10:45']] },
                  { title: 'VUELO DE LLEGADA', rows: [['Vuelo:', 'AV9475'], ['Ruta:', 'BGA 05:55 → BOG 07:00'], ['Fecha:', '30 de mayo']] },
                  { title: 'VUELO DE SALIDA', rows: [['Vuelo:', 'AV4804'], ['Ruta:', 'BOG 17:10 → BGA 18:10'], ['Fecha:', '04 de junio']] },
                  { title: 'HOSPEDAJE', rows: [['Hotel:', 'Hoteles Radel'], ['Dirección:', 'Calle 24a # 44a - 65'], ['Check-in:', '30 de mayo'], ['Check-out:', '04 de junio']] },
                  { title: 'ENTRENAMIENTOS', rows: [['Sesión 1:', 'Martes 02 de junio'], ['Sesión 2:', 'Miércoles 03 de junio']] },
                ].map((section) => (
                  <div key={section.title} style={{ marginBottom: '16px' }}>
                    <div style={{ color: '#c9a030', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', paddingBottom: '4px', borderBottom: '1px solid rgba(201,160,48,0.3)' }}>{section.title}</div>
                    {section.rows.map(([label, value]) => (
                      <div key={label} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ color: '#c9a030', fontSize: '13px', minWidth: '140px', fontWeight: 600 }}>{label}</span>
                        <span style={{ color: '#fff', fontSize: '13px' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                ))}

                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(201,160,48,0.3)', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '10px', letterSpacing: '0.5px' }}>
                  GARANTÍA DE 8 SEMANAS POR CONTRATO • VISAS ELITE 2025
                </div>
              </div>

              <button className="mt-6 inline-flex items-center gap-2 bg-[#c9a030] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#b08020] transition-colors">
                📥 Descargar imagen PNG
              </button>
              <p className="text-xs text-[#6b7a99] mt-2">La imagen se descarga lista para compartir en WhatsApp</p>
            </div>
          </section>

          {/* ===== ADMIN ===== */}
          <section id="admin" className="pb-16">
            <p className="text-xs font-bold text-[#6b7a99] uppercase tracking-widest mb-4">Vista 4 — Panel Admin (Catalina)</p>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">🛡️</span>
              <h1 className="text-2xl font-bold text-[#0f1e35]">Panel Administrador</h1>
            </div>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {[['24', 'Total', '📁', 'bg-[#0f2447]/8'], ['5', 'Empleados', '👥', 'bg-blue-50'], ['12', 'En Proceso', '⏳', 'bg-amber-50'], ['9', 'Aprobadas', '✅', 'bg-emerald-50'], ['3', 'Negadas', '❌', 'bg-red-50']].map(([v, l, i, bg]) => (
                <div key={l} className={`bg-white rounded-xl border border-[#dde3f0] shadow-sm px-4 py-3 flex items-center gap-3`}>
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>{i}</div>
                  <div><p className="text-xl font-bold text-[#0f1e35]">{v}</p><p className="text-xs text-[#6b7a99]">{l}</p></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <h2 className="font-semibold text-[#0f1e35] mb-3">Todos los Casos</h2>
                <div className="bg-white rounded-xl border border-[#dde3f0] shadow-sm divide-y divide-[#dde3f0]">
                  {[
                    { name: 'Guzman', emp: 'María L.', status: 'en_proceso', date: '07/06' },
                    { name: 'Rodríguez', emp: 'Carlos R.', status: 'aprobada', date: '05/06' },
                    { name: 'Martínez', emp: 'Ana S.', status: 'negada', date: '03/06' },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0f2447]/8 rounded-lg flex items-center justify-center font-bold text-[#0f2447] text-sm">{c.name[0]}</div>
                        <div>
                          <p className="font-semibold text-[#0f1e35] text-sm">Familia {c.name}</p>
                          <p className="text-xs text-[#6b7a99]">{c.emp} · {c.date}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        c.status === 'en_proceso' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        c.status === 'aprobada' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {c.status === 'en_proceso' ? 'En Proceso' : c.status === 'aprobada' ? 'Aprobada' : 'Negada'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold text-[#0f1e35] mb-3">Próximas Reuniones</h2>
                  <div className="bg-white rounded-xl border border-[#dde3f0] shadow-sm divide-y divide-[#dde3f0]">
                    {[['Familia Guzman', '10 de junio a las 15:00'], ['Familia Torres', '11 de junio a las 10:00']].map(([f, h]) => (
                      <div key={f} className="px-4 py-3"><p className="text-sm font-semibold text-[#0f1e35]">{f}</p><p className="text-xs text-[#6b7a99]">{h}</p><p className="text-xs text-[#0f2447]">Unirse al Meet</p></div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold text-[#0f1e35] mb-3">Equipo</h2>
                  <div className="bg-white rounded-xl border border-[#dde3f0] shadow-sm divide-y divide-[#dde3f0]">
                    {[['Catalina C.', 'Administrador', '#c9a030'], ['María L.', 'Empleado', '#0f2447'], ['Carlos R.', 'Empleado', '#0f2447']].map(([n, r, c]) => (
                      <div key={n} className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: c }}>{n[0]}</div>
                        <div><p className="text-sm font-medium text-[#0f1e35]">{n}</p><p className="text-xs text-[#6b7a99]">{r}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
