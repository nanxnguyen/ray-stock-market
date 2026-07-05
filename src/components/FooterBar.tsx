import { memo } from 'react'

function FooterBarInner() {
  return (
    <div className="bg-app border-t border-line-subtle text-txt-muted text-[10px] px-4 flex justify-between items-center shrink-0 h-8 font-mono">
      <div className="flex items-center gap-3">
        <span>Cơ sở: Giá ×1,000 {'\u2502'} KL ×1</span>
        <span className="text-line-subtle">{'\u2502'}</span>
        <span>Phái sinh: Giá ×1 {'\u2502'} KL ×1</span>
      </div>
      <div className="flex gap-[5px]" />
    </div>
  )
}

const FooterBar = memo(FooterBarInner)
export default FooterBar
