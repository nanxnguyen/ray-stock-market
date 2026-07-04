import { useState, useRef, useEffect } from 'react'
import type { ThemeTokens } from '../types/priceboard'

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

  // Calculate menu position from button
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
        style={{
          background: isActive ? 'var(--ds-color-blue-600)' : 'transparent',
          color: isActive ? 'var(--ds-color-text-inverse)' : th.tabFg,
          border: isActive ? 'none' : th.tabBorder,
          borderRadius: 5,
          padding: '3px 8px',
          fontSize: 11,
          fontWeight: activeValue ? '700' : '400',
          cursor: 'pointer',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {displayLabel}
        {arrow && items.length > 0 && <span style={{ fontSize: 8 }}>▾</span>}
      </button>
      {open && items.length > 0 && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: menuPos.top,
            left: menuPos.left,
            background: th.navBg,
            border: `1px solid ${th.navBorder}`,
            borderRadius: 5,
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          {columnItems.map((col, colIdx) => (
            <div key={colIdx} style={{ minWidth: 130 }}>
              {col.map((item) => (
                <div
                  key={item.value}
                  onClick={() => { onSelect(item.value); setOpen(false) }}
                  style={{
                    padding: '6px 10px',
                    cursor: 'pointer',
                    fontSize: 11,
                    color: item.value === activeValue ? 'var(--ds-color-text-inverse)' : th.text,
                    background: item.value === activeValue ? 'var(--ds-color-blue-600)' : 'transparent',
                  }}
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
