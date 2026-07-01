import { useState, useRef, useEffect, useMemo } from 'react'
import type { ThemeTokens } from '../types/priceboard'
import { symbolMap, getBoardName } from '../lib/vietcapNormalize'

type Props = {
  th: ThemeTokens
  onSelect: (symbol: string) => void
  placeholder?: string
}

export default function SymbolSearch({ th, onSelect, placeholder = 'Thêm mã ...' }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    if (!query || query.length < 1) return []
    const q = query.toLowerCase().trim()
    const matches: { symbol: string; board: string; name: string }[] = []
    for (const [sym, meta] of symbolMap) {
      if (matches.length >= 20) break
      const name = meta.companyNameEn || meta.companyName || meta.organShortName || meta.organName || ''
      if (sym.toLowerCase().includes(q) ||
          name.toLowerCase().includes(q)) {
        matches.push({
          symbol: sym,
          board: getBoardName(meta.board),
          name,
        })
      }
    }
    return matches
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIdx((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIdx((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightIdx >= 0 && highlightIdx < results.length) {
        onSelect(results[highlightIdx].symbol)
        setQuery('')
        setOpen(false)
      } else if (query) {
        onSelect(query.toUpperCase())
        setQuery('')
        setOpen(false)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function handleSelect(sym: string) {
    onSelect(sym)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={boxRef} style={{ position: 'relative', width: 160, flexShrink: 0 }}>
      <div style={{
        border: `1px solid ${th.navBorder}`,
        borderRadius: 5,
        padding: '3px 7px',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: th.appBg,
      }}>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            border: 'none',
            background: 'transparent',
            color: th.text,
            fontSize: 11,
            outline: 'none',
            width: '100%',
          }}
        />
      </div>
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: th.navBg,
          border: `1px solid ${th.navBorder}`,
          borderRadius: 5,
          marginTop: 2,
          maxHeight: 240,
          overflowY: 'auto',
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          {results.map((r, i) => (
            <div
              key={r.symbol}
              onClick={() => handleSelect(r.symbol)}
              style={{
                padding: '6px 10px',
                cursor: 'pointer',
                fontSize: 11,
                color: i === highlightIdx ? '#fff' : th.text,
                background: i === highlightIdx ? '#2563eb' : 'transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>
                <span style={{ color: th.symColor, fontWeight: 600 }}>{r.symbol}</span>
                <span style={{ color: th.tabFg, marginLeft: 4 }}>{r.board}</span>
              </span>
              <span style={{ color: th.tabFg, fontSize: 10, marginLeft: 8 }}>{r.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
