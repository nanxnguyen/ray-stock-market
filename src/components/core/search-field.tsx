import { SearchIcon, XIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

function SearchField({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className,
}: SearchFieldProps) {
  return (
    <div
      data-slot="search-field"
      className={cn(
        "relative flex items-center",
        className
      )}
    >
      <SearchIcon className="pointer-events-none absolute left-2.5 size-4 text-txt-muted" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded-lg border border-line bg-nav pl-8 pr-8 text-sm text-txt-primary placeholder:text-txt-muted focus-visible:border-blue-400 focus-visible:ring-blue-400/50"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 flex size-4 items-center justify-center rounded text-txt-muted hover:text-txt-primary"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  )
}

export { SearchField }
