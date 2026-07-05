import { useState, useRef, useEffect } from 'react'
import type { ThemeTokens } from '../types/priceboard'
import { cn } from '../lib/utils'

type DropdownItem = {
  label: string
  value: string
}

type Props = {
  th: ThemeTokens
  label: string
  items: DropdownItem[]
  activeValue: string
  onSelect: (value: string) => void
  arrow?: boolean
  columns?: number
}

export default function FilterDropdown({ th, label, items, activeValue, onSelect, arrow = true, columns = 1 }: Props) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (btnRef.current?.contains(target)) return
      if (menuRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeItem = items.find((i) => i.value === activeValue)
  const displayLabel = activeItem ? activeItem.label : label

  const isActive = activeValue !== '' && items.some((i) => i.value === activeValue)

  const columnItems = (() => {
    if (columns <= 1) return [items]
    const cols: DropdownItem[][] = Array.from({ length: columns }, () => [])
    items.forEach((item, i) => {
      cols[i % columns].push(item)
    })
    return cols
  })()

  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setMenuPos({ top: rect.bottom + 2, left: rect.left })
    }
  }, [open])

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex shrink-0 cursor-pointer items-center gap-1 rounded-[5px] border px-2 py-[3px] text-[11px] whitespace-nowrap transition-colors",
          isActive
            ? "border-none bg-blue-600 text-txt-inverse font-bold"
            : "border-line bg-transparent text-txt-secondary font-normal hover:bg-row-hover"
        )}
      >
        {displayLabel}
        {arrow && items.length > 0 && <span className="text-[8px]">▾</span>}
      </button>
      {open && items.length > 0 && (
        <div
          ref={menuRef}
          className="fixed z-[200] flex flex-row rounded-[5px] border border-line bg-card shadow-lg"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {columnItems.map((col, colIdx) => (
            <div key={colIdx} className="min-w-[130px]">
              {col.map((item) => (
                <div
                  key={item.value}
                  onClick={() => { onSelect(item.value); setOpen(false) }}
                  className={cn(
                    "cursor-pointer px-[10px] py-[6px] text-[11px]",
                    item.value === activeValue
                      ? "bg-blue-600 text-white"
                      : "bg-transparent text-txt-primary hover:bg-row-hover"
                  )}
                >
                  {item.label}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
