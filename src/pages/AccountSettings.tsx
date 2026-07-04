import { memo, useState } from 'react'

function AccountSettingsInner() {
  const [section, setSection] = useState('profile')
  const [twoFA, setTwoFA] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [notif, setNotif] = useState({ price: true, news: true, order: true, promo: false })

  const th = {
    pageBg: '#0a0e14',
    cardBg: '#131a24',
    cardBorder: '#232b38',
    inputBg: '#0f1419',
    disabledBg: '#0c1017',
    text: '#eef1f6',
    textMuted: '#8a94a6',
  }

  const sections = [
    { key: 'profile', label: 'Hồ sơ', icon: '👤' },
    { key: 'security', label: 'Bảo mật', icon: '🔒' },
    { key: 'notif', label: 'Thông báo', icon: '🔔' },
    { key: 'appearance', label: 'Giao diện', icon: '🎨' },
  ]

  const notifDefs = [
    { key: 'price' as const, label: 'Cảnh báo giá', desc: 'Nhận thông báo khi giá chạm ngưỡng đặt' },
    { key: 'news' as const, label: 'Tin tức thị trường', desc: 'Cập nhật tin tức liên quan đến danh mục của bạn' },
    { key: 'order' as const, label: 'Trạng thái lệnh', desc: 'Thông báo khi lệnh khớp, hủy hoặc từ chối' },
    { key: 'promo' as const, label: 'Ưu đãi & Khuyến mãi', desc: 'Nhận thông tin về chương trình ưu đãi' },
  ]

  const toggleNotif = (key: keyof typeof notif) => setNotif(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: th.pageBg, padding: 24 }}>
      <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: th.text }}>CÀI ĐẶT TÀI KHOẢN</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sections.map(s => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                style={{
                  textAlign: 'left',
                  background: section === s.key ? '#1a2536' : 'transparent',
                  color: section === s.key ? '#60a5fa' : th.textMuted,
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {section === 'profile' && (
              <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 13, fontWeight: 700, color: th.text }}>Hồ sơ cá nhân</h3>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, fontWeight: 800, color: '#fff',
                  }}>NA</div>
                  <button style={{
                    background: th.inputBg, border: `1px solid ${th.cardBorder}`, color: th.text,
                    borderRadius: 7, padding: '8px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  }}>Đổi ảnh đại diện</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' as const }}>Họ và tên</label>
                    <input type="text" defaultValue="Nguyễn Văn A" style={{ padding: '9px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 12 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' as const }}>Số điện thoại</label>
                    <input type="text" defaultValue="0912 345 678" style={{ padding: '9px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 12 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, gridColumn: 'span 2' }}>
                    <label style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' as const }}>Email</label>
                    <input type="email" defaultValue="nguyenvana@email.com" style={{ padding: '9px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 12 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, gridColumn: 'span 2' }}>
                    <label style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' as const }}>Số tài khoản chứng khoán</label>
                    <input type="text" defaultValue="069C123456" disabled style={{ padding: '9px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.disabledBg, color: th.textMuted, fontSize: 12 }} />
                  </div>
                </div>
                <button style={{ marginTop: 16, background: '#22c55e', border: 'none', color: '#fff', borderRadius: 7, padding: '10px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Lưu thay đổi</button>
              </div>
            )}

            {section === 'security' && (
              <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 13, fontWeight: 700, color: th.text }}>Bảo mật</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' as const }}>Mật khẩu hiện tại</label>
                    <input type="password" style={{ padding: '9px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 12 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' as const }}>Mật khẩu mới</label>
                    <input type="password" style={{ padding: '9px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 12 }} />
                  </div>
                </div>
                <button style={{ background: '#3b82f6', border: 'none', color: '#fff', borderRadius: 7, padding: '10px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginBottom: 18 }}>Đổi mật khẩu</button>
                <div style={{ borderTop: `1px solid ${th.cardBorder}`, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: th.text }}>Xác thực 2 lớp (2FA)</span>
                    <p style={{ margin: '2px 0 0 0', fontSize: 10.5, color: th.textMuted }}>Bảo vệ tài khoản bằng mã OTP qua ứng dụng</p>
                  </div>
                  <div
                    onClick={() => setTwoFA(!twoFA)}
                    style={{
                      width: 40, height: 22, borderRadius: 11,
                      background: twoFA ? '#22c55e' : '#2a3340',
                      position: 'relative', cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: '#fff',
                      position: 'absolute', top: 2,
                      left: twoFA ? 20 : 2, transition: 'left .2s',
                    }} />
                  </div>
                </div>
              </div>
            )}

            {section === 'notif' && (
              <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 13, fontWeight: 700, color: th.text }}>Thông báo</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {notifDefs.map(nt => (
                    <div key={nt.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: th.text }}>{nt.label}</span>
                        <p style={{ margin: '2px 0 0 0', fontSize: 10.5, color: th.textMuted }}>{nt.desc}</p>
                      </div>
                      <div
                        onClick={() => toggleNotif(nt.key)}
                        style={{
                          width: 40, height: 22, borderRadius: 11,
                          background: notif[nt.key] ? '#22c55e' : '#2a3340',
                          position: 'relative', cursor: 'pointer', flexShrink: 0,
                        }}
                      >
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', background: '#fff',
                          position: 'absolute', top: 2,
                          left: notif[nt.key] ? 20 : 2, transition: 'left .2s',
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === 'appearance' && (
              <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 13, fontWeight: 700, color: th.text }}>Giao diện</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' as const }}>Chủ đề</label>
                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                      <button
                        onClick={() => setTheme('dark')}
                        style={{
                          background: theme === 'dark' ? '#2563eb' : th.inputBg,
                          color: theme === 'dark' ? '#fff' : th.textMuted,
                          border: `1px solid ${theme === 'dark' ? '#2563eb' : th.cardBorder}`,
                          borderRadius: 7, padding: '8px 16px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                        }}
                      >🌙 Tối</button>
                      <button
                        onClick={() => setTheme('light')}
                        style={{
                          background: theme === 'light' ? '#2563eb' : th.inputBg,
                          color: theme === 'light' ? '#fff' : th.textMuted,
                          border: `1px solid ${theme === 'light' ? '#2563eb' : th.cardBorder}`,
                          borderRadius: 7, padding: '8px 16px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                        }}
                      >☀️ Sáng</button>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textTransform: 'uppercase' as const }}>Ngôn ngữ</label>
                    <select style={{ display: 'block', marginTop: 6, padding: '9px 10px', border: `1px solid ${th.cardBorder}`, borderRadius: 7, background: th.inputBg, color: th.text, fontSize: 12, width: 200 }}>
                      <option>Tiếng Việt</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const AccountSettings = memo(AccountSettingsInner)
export default AccountSettings
