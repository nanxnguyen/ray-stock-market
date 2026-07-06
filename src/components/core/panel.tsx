import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const panelVariants = cva(
  "border-line",
  {
    variants: {
      variant: {
        default: "bg-nav border-line rounded-lg",
        elevated: "bg-card border-line rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface PanelProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof panelVariants> {}

function Panel({
  className,
  variant = "default",
  children,
  ...props
}: PanelProps) {
  return (
    <div
      data-slot="panel"
      className={cn(panelVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Panel }
