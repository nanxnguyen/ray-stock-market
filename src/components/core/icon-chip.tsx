import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const iconChipVariants = cva(
  "inline-flex items-center justify-center rounded-lg border border-line bg-nav text-txt-secondary transition-colors cursor-pointer select-none hover:bg-row-hover",
  {
    variants: {
      active: {
        true: "bg-blue-600 border-blue-600 text-white",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

interface IconChipProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof iconChipVariants> {
  icon: React.ReactNode
  label?: string
}

function IconChip({
  className,
  icon,
  label,
  active = false,
  ...props
}: IconChipProps) {
  return (
    <button
      data-slot="icon-chip"
      data-active={active || undefined}
      className={cn(
        "size-7",
        iconChipVariants({ active }),
        className
      )}
      title={label}
      {...props}
    >
      {icon}
    </button>
  )
}

export { IconChip }
