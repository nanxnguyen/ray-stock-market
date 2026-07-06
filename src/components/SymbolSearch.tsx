import { useState, useRef, useEffect } from 'react'
import type { ThemeTokens } from '../types/priceboard'
import { cn } from '../lib/utils'

type Props = {
  th: ThemeTokens
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SymbolSearch({ value, onChange, placeholder = 'Tìm mã ...' }: Props) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-[160px] shrink-0">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-[5px] border bg-nav px-7 py-[3px] text-[11px] text-txt-primary outline-none placeholder:text-txt-muted transition-colors duration-150",
          focused ? "border-blue-500 focus:ring-2 focus:ring-blue-400" : "border-line"
        )}
      />
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-txt-muted">
        🔍
      </span>
      {value && (
        <button
          type="button"
          onClick={() => { onChange(''); inputRef.current?.focus() }}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-[10px] text-txt-muted hover:text-txt-primary"
        >
          ✕
        </button>
      )}
    </div>
  )
}
