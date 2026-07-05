import { useState, useCallback } from 'react'
import type { AlertModalState } from '../types/priceboard'

type Props = {
  alert: AlertModalState
  onClose: () => void
  onSave: (sym: string, threshold: number, direction: 'above' | 'below') => void
}

export default function AlertModal({ alert, onClose, onSave }: Props) {
  const [direction, setDirection] = useState<'above' | 'below'>(alert.direction)
  const [threshold, setThreshold] = useState(alert.threshold)

  const handleSave = useCallback(() => {
    const val = parseFloat(threshold)
    if (!isNaN(val) && val > 0) {
      onSave(alert.sym, val, direction)
    }
  }, [alert.sym, threshold, direction, onSave])

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[320px] max-w-[92vw] rounded-xl bg-card border border-line p-5 animate-fadeUp"
      >
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[13px] font-extrabold text-txt-primary">
            {'\u{1F514}'} Cảnh báo giá — {alert.sym}
          </span>
          <button
            onClick={onClose}
            className="text-txt-muted text-base cursor-pointer bg-transparent border-none hover:text-txt-primary"
          >
            {'\u2715'}
          </button>
        </div>

        <div className="flex gap-1.5 mb-3">
          <button
            onClick={() => setDirection('above')}
            className={`flex-1 rounded-md py-[7px] text-[11px] font-bold cursor-pointer border border-line ${
              direction === 'above'
                ? 'bg-blue-600 text-white'
                : 'bg-card text-txt-muted'
            }`}
          >
            Giá LÊN đến
          </button>
          <button
            onClick={() => setDirection('below')}
            className={`flex-1 rounded-md py-[7px] text-[11px] font-bold cursor-pointer border border-line ${
              direction === 'below'
                ? 'bg-blue-600 text-white'
                : 'bg-card text-txt-muted'
            }`}
          >
            Giá XUỐNG đến
          </button>
        </div>

        <input
          type="number"
          step="0.01"
          placeholder="Ngưỡng giá"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          className="w-full rounded-md bg-nav border border-line text-txt-primary font-mono text-sm p-2 outline-none box-border mb-3.5"
        />

        <button
          onClick={handleSave}
          className="w-full rounded-md bg-green-500 text-white border-none py-2.5 text-xs font-extrabold cursor-pointer hover:opacity-90"
        >
          Lưu cảnh báo
        </button>
      </div>
    </div>
  )
}
