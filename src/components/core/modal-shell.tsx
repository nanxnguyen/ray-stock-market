import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ModalShellProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
}

function ModalShell({
  open,
  onClose,
  children,
  title,
  className,
}: ModalShellProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "bg-app border-line rounded-xl shadow-2xl",
          className
        )}
      >
        {title && (
          <DialogTitle className="text-txt-primary font-heading text-base font-medium">
            {title}
          </DialogTitle>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}

export { ModalShell }
