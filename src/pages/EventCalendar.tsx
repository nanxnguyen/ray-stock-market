import { memo } from 'react'

function EventCalendarInner() {
  const th = {
    pageBg: 'var(--ds-color-bg-app)',
    cardBg: 'var(--ds-color-bg-elevated)',
    cardBorder: 'var(--ds-color-border-strong)',
    text: 'var(--ds-color-text-primary)',
    textMuted: 'var(--ds-color-text-secondary)',
    iconBg: 'var(--ds-color-bg-elevated)',
  }

  const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  const today = 3
  const startOffset = 2
  const daysInMonth = 31

  const eventDays: Record<number, string> = { 8: 'divs', 12: 'agm', 15: 'divs', 18: 'rights', 22: 'agm', 25: 'rights', 29: 'divs' }
  const colorMap: Record<string, string> = { agm: 'var(--ds-color-purple-400)', divs: 'var(--ds-color-market-up)', rights: 'var(--ds-color-warning)' }

  const calDays: { num: number | string; bg: string; border: string; fg: string; fw: string; opacity: number; hasEvent: boolean; dotColor: string }[] = []
  for (let i = 0; i < startOffset; i++) {
    calDays.push({ num: '', bg: 'transparent', border: 'transparent', fg: 'transparent', fw: '400', opacity: 0, hasEvent: false, dotColor: 'transparent' })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today
    const evType = eventDays[d]
    calDays.push({
      num: d,
      bg: isToday ? 'var(--ds-color-blue-600)' : th.iconBg,
      border: isToday ? 'var(--ds-color-blue-600)' : th.cardBorder,
      fg: isToday ? '#fff' : th.text,
      fw: isToday ? '800' : '500',
      opacity: 1,
      hasEvent: !!evType,
      dotColor: evType ? colorMap[evType] : 'transparent',
    })
  }

  const eventsRaw = [
    { symbol: 'VCB', type: 'Cổ tức', typeKey: 'divs', desc: 'Chi trả cổ tức tiền mặt 12%/năm', date: '08/07/2026', days: 5 },
    { symbol: 'FPT', type: 'ĐHCĐ', typeKey: 'agm', desc: 'Đại hội cổ đông thường niên 2026', date: '12/07/2026', days: 9 },
    { symbol: 'HPG', type: 'Chốt quyền', typeKey: 'rights', desc: 'Chốt DS cổ đông phát hành thêm CP', date: '18/07/2026', days: 15 },
    { symbol: 'ACB', type: 'ĐHCĐ', typeKey: 'agm', desc: 'Đại hội cổ đông thường niên 2026', date: '22/07/2026', days: 19 },
    { symbol: 'MWG', type: 'Chốt quyền', typeKey: 'rights', desc: 'Chốt quyền nhận cổ phiếu thưởng', date: '25/07/2026', days: 22 },
    { symbol: 'VNM', type: 'Cổ tức', typeKey: 'divs', desc: 'Tạm ứng cổ tức đợt 2/2026', date: '29/07/2026', days: 26 },
  ]

  const events = eventsRaw.map(e => ({
    ...e,
    color: colorMap[e.typeKey],
    bg: colorMap[e.typeKey] + '26',
    daysLeft: e.days,
  }))

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: th.pageBg, padding: 24 }}>
      <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: th.text }}>LỊCH SỰ KIỆN DOANH NGHIỆP</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, alignItems: 'start' }}>
          {/* Calendar Grid */}
          <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: th.text }}>Tháng 7, 2026</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ background: th.iconBg, border: `1px solid ${th.cardBorder}`, color: th.textMuted, borderRadius: 5, width: 26, height: 26, cursor: 'pointer' }}>‹</button>
                <button style={{ background: th.iconBg, border: `1px solid ${th.cardBorder}`, color: th.textMuted, borderRadius: 5, width: 26, height: 26, cursor: 'pointer' }}>›</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
              {weekdays.map(wd => (
                <span key={wd} style={{ fontSize: 9.5, fontWeight: 700, color: th.textMuted, textAlign: 'center', textTransform: 'uppercase' }}>{wd}</span>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {calDays.map((d, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 7,
                    background: d.bg,
                    border: `1px solid ${d.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    opacity: d.opacity,
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: Number(d.fw) as 400 | 500 | 700 | 800, color: d.fg }}>{d.num}</span>
                  {d.hasEvent && (
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: d.dotColor }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${th.cardBorder}` }}>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ds-color-purple-400)' }} />
                <span style={{ fontSize: 9.5, color: th.textMuted }}>ĐHCĐ</span>
              </div>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ds-color-market-up)' }} />
                <span style={{ fontSize: 9.5, color: th.textMuted }}>Cổ tức</span>
              </div>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ds-color-warning)' }} />
                <span style={{ fontSize: 9.5, color: th.textMuted }}>Chốt quyền</span>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: th.text, textTransform: 'uppercase' }}>Sự kiện sắp tới</h3>
            {events.map(ev => (
              <div key={ev.symbol + ev.type} style={{
                background: th.cardBg, border: `1px solid ${th.cardBorder}`,
                borderLeft: `3px solid ${ev.color}`,
                borderRadius: 8, padding: '12px 14px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ds-color-text-link)', fontFamily: "'JetBrains Mono', monospace" }}>{ev.symbol}</span>
                    <span style={{
                      fontSize: 8.5, fontWeight: 700, color: ev.color, background: ev.bg,
                      padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase',
                    }}>{ev.type}</span>
                  </div>
                  <span style={{ fontSize: 11, color: th.text, fontWeight: 600 }}>{ev.desc}</span>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: th.text, fontFamily: "'JetBrains Mono', monospace" }}>{ev.date}</div>
                  <div style={{ fontSize: 9, color: th.textMuted }}>Còn {ev.daysLeft} ngày</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const EventCalendar = memo(EventCalendarInner)
export default EventCalendar
