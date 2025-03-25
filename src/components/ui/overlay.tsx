import * as React from "react"
import { cn } from "@/lib/utils"
import { AudioLines } from "lucide-react"

interface OverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export function Overlay({ className, children, ...props }: OverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-4 pointer-events-none">
        <AudioLines className="h-8 w-8 text-white animate-pulse" />
        <p className="text-lg font-medium text-white">{children}</p>
      </div>
    </div>
  )
}