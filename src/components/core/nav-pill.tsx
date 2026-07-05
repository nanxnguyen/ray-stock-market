import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const navPillVariants = cva(
  "inline-flex items-center rounded-lg text-sm font-medium transition-colors outline-none select-none",
  {
    variants: {
      active: {
        true: "bg-blue-600 text-white",
        false: "text-txt-secondary hover:text-txt-primary",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

interface NavPillProps
  extends React.ComponentProps<"a">,
    VariantProps<typeof navPillVariants> {}

function NavPill({
  className,
  active = false,
  children,
  ...props
}: NavPillProps) {
  return (
    <a
      data-slot="nav-pill"
      data-active={active || undefined}
      className={cn(navPillVariants({ active }), className)}
      {...props}
    >
      {children}
    </a>
  )
}

export { NavPill, navPillVariants }
