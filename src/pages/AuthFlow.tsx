import { memo, useState } from 'react'

const th = {
  pageBg: '#060c18',
  cardBg: '#131a24',
  cardBorder: '#232b38',
  inputBg: '#0f1419',
  text: '#eef1f6',
  textMuted: '#8a94a6',
  iconBg: '#1a212c',
}

function AuthFlowInner() {
  const [step, setStep] = useState<'login' | 'register' | 'kyc' | 'done'>('login')
  const [frontUploaded, setFrontUploaded] = useState(false)
  const [backUploaded, setBackUploaded] = useState(false)
  const [selfieUploaded, setSelfieUploaded] = useState(false)

  const stepIndex = { login: 0, register: 1, kyc: 2, done: 3 }[step]
  const stepLabels = ['Đăng nhập', 'Đăng ký', 'Xác thực']
  const steps = stepLabels.map((label, i) => ({
    n: i + 1,
    label,
    bg: i <= stepIndex ? '#22c55e' : th.iconBg,
    fg: i <= stepIndex ? '#fff' : th.textMuted,
    border: i <= stepIndex ? '#22c55e' : th.cardBorder,
    labelColor: i <= stepIndex ? th.text : th.textMuted,
  }))

  const allUploaded = frontUploaded && backUploaded && selfieUploaded

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: th.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 440, width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#22c55e,#16a34a)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="14" viewBox="0 0 14 12"><polygon points="7,0 14,12 0,12" fill="#fff" /></svg>
          </div>
          <span style={{ fontSize: 19, fontWeight: 800, color: '#fff' }}>Ray <span style={{ color: '#22c55e' }}>Stock Market</span></span>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {steps.map((st, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: st.bg, color: st.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, border: `1px solid ${st.border}` }}>{st.n}</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: st.labelColor }}>{st.label}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: th.cardBg, border: `1px solid ${th.cardBorder}`, borderRadius: 14, padding: 26, boxShadow: '0 20px 60px rgba(0,0,0,.4)' }}>

          {/* STEP 1: LOGIN */}
          {step === 'login' && (
            <>
              <h2 style={{ margin: '0 0 4px 0', fontSize: 18, fontWeight: 800, color: th.text }}>Đăng nhập</h2>
              <p style={{ margin: '0 0 18px 0', fontSize: 11, color: th.textMuted }}>Truy cập tài khoản giao dịch của bạn</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Số điện thoại / Email</label>
                  <input type="text" placeholder="0912 345 678" style={{ padding: '11px 12px', border: `1px solid ${th.cardBorder}`, borderRadius: 8, background: th.inputBg, color: th.text, fontSize: 13, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Mật khẩu</label>
                  <input type="password" placeholder="••••••••" style={{ padding: '11px 12px', border: `1px solid ${th.cardBorder}`, borderRadius: 8, background: th.inputBg, color: th.text, fontSize: 13, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: th.textMuted }}><input type="checkbox" /> Ghi nhớ đăng nhập</label>
                  <a href="#" style={{ fontSize: 11, color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>Quên mật khẩu?</a>
                </div>
                <button onClick={() => setStep('login')} style={{ background: '#22c55e', border: 'none', color: '#fff', borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 20px rgba(34,197,94,.3)' }}>Đăng nhập</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0' }}>
                  <div style={{ flex: 1, height: 1, background: th.cardBorder }} />
                  <span style={{ fontSize: 10, color: th.textMuted }}>HOẶC</span>
                  <div style={{ flex: 1, height: 1, background: th.cardBorder }} />
                </div>
                <button onClick={() => setStep('register')} style={{ background: 'transparent', border: `1px solid ${th.cardBorder}`, color: th.text, borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Tạo tài khoản mới</button>
              </div>
            </>
          )}

          {/* STEP 2: REGISTER */}
          {step === 'register' && (
            <>
              <h2 style={{ margin: '0 0 4px 0', fontSize: 18, fontWeight: 800, color: th.text }}>Tạo tài khoản</h2>
              <p style={{ margin: '0 0 18px 0', fontSize: 11, color: th.textMuted }}>Mở tài khoản giao dịch chứng khoán miễn phí</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Họ và tên</label>
                  <input type="text" placeholder="Nguyễn Văn A" style={{ padding: '11px 12px', border: `1px solid ${th.cardBorder}`, borderRadius: 8, background: th.inputBg, color: th.text, fontSize: 13, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Số điện thoại</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input type="text" placeholder="0912 345 678" style={{ flex: 1, padding: '11px 12px', border: `1px solid ${th.cardBorder}`, borderRadius: 8, background: th.inputBg, color: th.text, fontSize: 13, outline: 'none' }} />
                    <button style={{ background: th.iconBg, border: `1px solid ${th.cardBorder}`, color: '#60a5fa', borderRadius: 8, padding: '0 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Gửi OTP</button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Email</label>
                  <input type="email" placeholder="email@vidu.com" style={{ padding: '11px 12px', border: `1px solid ${th.cardBorder}`, borderRadius: 8, background: th.inputBg, color: th.text, fontSize: 13, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase' }}>Mật khẩu</label>
                  <input type="password" placeholder="Tối thiểu 8 ký tự" style={{ padding: '11px 12px', border: `1px solid ${th.cardBorder}`, borderRadius: 8, background: th.inputBg, color: th.text, fontSize: 13, outline: 'none' }} />
                </div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 10.5, color: th.textMuted }}><input type="checkbox" style={{ marginTop: 2 }} /> Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật</label>
                <button onClick={() => setStep('kyc')} style={{ background: '#22c55e', border: 'none', color: '#fff', borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 20px rgba(34,197,94,.3)' }}>Tiếp tục</button>
                <button onClick={() => setStep('login')} style={{ background: 'transparent', border: 'none', color: th.textMuted, fontSize: 11, fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}>← Đã có tài khoản? Đăng nhập</button>
              </div>
            </>
          )}

          {/* STEP 3: KYC */}
          {step === 'kyc' && (
            <>
              <h2 style={{ margin: '0 0 4px 0', fontSize: 18, fontWeight: 800, color: th.text }}>Xác thực danh tính (eKYC)</h2>
              <p style={{ margin: '0 0 18px 0', fontSize: 11, color: th.textMuted }}>Chụp ảnh CCCD để hoàn tất mở tài khoản</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div onClick={() => setFrontUploaded(true)} style={{ aspectRatio: '1.58', border: `2px dashed ${frontUploaded ? '#22c55e' : th.cardBorder}`, borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', background: th.inputBg }}>
                    <span style={{ fontSize: 22 }}>{frontUploaded ? '✅' : '🪪'}</span>
                    <span style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textAlign: 'center' }}>{frontUploaded ? 'Mặt trước đã tải' : 'Tải mặt trước CCCD'}</span>
                  </div>
                  <div onClick={() => setBackUploaded(true)} style={{ aspectRatio: '1.58', border: `2px dashed ${backUploaded ? '#22c55e' : th.cardBorder}`, borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', background: th.inputBg }}>
                    <span style={{ fontSize: 22 }}>{backUploaded ? '✅' : '🪪'}</span>
                    <span style={{ fontSize: 10, color: th.textMuted, fontWeight: 700, textAlign: 'center' }}>{backUploaded ? 'Mặt sau đã tải' : 'Tải mặt sau CCCD'}</span>
                  </div>
                </div>
                <div onClick={() => setSelfieUploaded(true)} style={{ border: `2px dashed ${selfieUploaded ? '#22c55e' : th.cardBorder}`, borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', background: th.inputBg }}>
                  <span style={{ fontSize: 22 }}>{selfieUploaded ? '✅' : '🤳'}</span>
                  <span style={{ fontSize: 10, color: th.textMuted, fontWeight: 700 }}>{selfieUploaded ? 'Ảnh chân dung đã tải' : 'Chụp ảnh chân dung (Selfie)'}</span>
                </div>
                <button onClick={() => { if (allUploaded) setStep('done') }} style={{ background: allUploaded ? '#22c55e' : th.iconBg, border: 'none', color: allUploaded ? '#fff' : th.textMuted, borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>Hoàn tất đăng ký</button>
              </div>
            </>
          )}

          {/* STEP 4: DONE */}
          {step === 'done' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, padding: '10px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,197,94,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>✓</div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: th.text }}>Đăng ký thành công!</h2>
              <p style={{ margin: 0, fontSize: 12, color: th.textMuted }}>Tài khoản của bạn đang được xét duyệt. Chúng tôi sẽ thông báo qua email trong 24h.</p>
              <a href="#" style={{ marginTop: 8, textDecoration: 'none', background: '#22c55e', color: '#fff', borderRadius: 8, padding: '11px 20px', fontSize: 12, fontWeight: 800 }}>Về Bảng điện</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const AuthFlow = memo(AuthFlowInner)
export default AuthFlow
