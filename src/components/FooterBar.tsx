import { memo } from 'react'

function FooterBarInner() {
  return (
    <div style={{
      background: 'var(--ds-color-bg-app)', borderTop: '1px solid var(--ds-color-border-subtle)',
      color: 'var(--ds-color-text-muted)', fontSize: 10, padding: '0 16px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexShrink: 0, height: 32,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span>Cơ sở: Giá ×1,000 {'\u2502'} KL ×1</span>
        <span style={{ color: 'var(--ds-color-border-subtle)' }}>{'\u2502'}</span>
        <span>Phái sinh: Giá ×1 {'\u2502'} KL ×1</span>
      </div>
      <div style={{ display: 'flex', gap: 5 }} />
    </div>
  )
}

const FooterBar = memo(FooterBarInner)
export default FooterBar
