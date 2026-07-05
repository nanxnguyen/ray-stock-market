import { memo } from 'react'

type Props = {
  selected: string[]
  onRemove: (sym: string) => void
  onClear: () => void
  onCompare: () => void
}

function CompareBarInner({ selected, onRemove, onClear, onCompare }: Props) {
  if (selected.length === 0) return null

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-3 rounded-xl bg-card border border-blue-600 px-4 py-2.5 shadow-xl animate-fadeUp">
      <span className="text-[11px] font-bold text-blue-400 whitespace-nowrap">
        So sánh ({selected.length}/5):
      </span>
      <div className="flex gap-1.5 flex-wrap max-w-[280px]">
        {selected.map((sym) => (
          <span
            key={sym}
            onClick={() => onRemove(sym)}
            className="bg-nav text-txt-primary rounded-md px-2 py-[3px] text-[10.5px] font-bold cursor-pointer whitespace-nowrap hover:opacity-80"
          >
            {sym} {'\u2715'}
          </span>
        ))}
      </div>
      <button
        onClick={onCompare}
        className="rounded-md bg-green-500 text-white px-3.5 py-1.5 text-[11px] font-extrabold whitespace-nowrap cursor-pointer border-none hover:opacity-90"
      >
        So sánh ngay {'\u2192'}
      </button>
      <button
        onClick={onClear}
        className="rounded-md bg-transparent border border-line text-txt-muted px-2.5 py-1.5 text-[10.5px] cursor-pointer whitespace-nowrap hover:text-txt-primary"
      >
        Xóa hết
      </button>
    </div>
  )
}

const CompareBar = memo(CompareBarInner)
export default CompareBar
