import { memo } from 'react'

function FooterBarInner() {
  return (
    <div style={{
      background: '#060c18', borderTop: '1px solid #0f1e36',
      color: '#3a5570', fontSize: 10, padding: '0 16px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexShrink: 0, height: 32,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span>Cơ sở: Giá ×1,000 {'\u2502'} KL ×1</span>
        <span style={{ color: '#1e3a5f' }}>{'\u2502'}</span>
        <span>Phái sinh: Giá ×1 {'\u2502'} KL ×1</span>
      </div>
      <div style={{ display: 'flex', gap: 5 }} />
    </div>
  )
}

const FooterBar = memo(FooterBarInner)
export default FooterBar
