import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const retroButtonVariants = cva(
  "relative inline-flex items-center justify-center border-2 border-transparent rounded-[5%] bg-[#0c0c0e] shadow-[0px_1px_0px_rgba(255,255,255,0.15),_inset_0px_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300",
  {
    variants: {
      variant: {
        default: [
          "text-white",
          "[--bg-color:#f59e0b]",
          "[--bg-color-active:#d97706]",
          "[--shadow-light:#fcd34d]",
          "[--shadow-dark:#b45309]",
          "[--led-color:#f59e0b]",
        ],
        amber: [
          "text-white",
          "[--bg-color:#f59e0b]",
          "[--bg-color-active:#d97706]",
          "[--shadow-light:#fcd34d]",
          "[--shadow-dark:#b45309]",
          "[--led-color:#f59e0b]",
        ],
        orange: [
          "text-white",
          "[--bg-color:#f97316]",
          "[--bg-color-active:#ea580c]",
          "[--shadow-light:#fdba74]",
          "[--shadow-dark:#c2410c]",
          "[--led-color:#f97316]",
        ],
        red: [
          "text-white",
          "[--bg-color:#ef4444]",
          "[--bg-color-active:#dc2626]",
          "[--shadow-light:#fca5a5]",
          "[--shadow-dark:#b91c1c]",
          "[--led-color:#ef4444]",
        ],
        emerald: [
          "text-white",
          "[--bg-color:#10b981]",
          "[--bg-color-active:#059669]",
          "[--shadow-light:#6ee7b7]",
          "[--shadow-dark:#047857]",
          "[--led-color:#10b981]",
        ],
        darkGray: [
          "text-[#a3a3a3]",
          "[--bg-color:#262626]",
          "[--bg-color-active:#171717]",
          "[--shadow-light:#525252]",
          "[--shadow-dark:#0a0a0a]",
          "[--led-color:#3b82f6]",
        ],
        gray: [
          "text-[#e5e5e5]",
          "[--bg-color:#404040]",
          "[--bg-color-active:#262626]",
          "[--shadow-light:#737373]",
          "[--shadow-dark:#171717]",
          "[--led-color:#10b981]",
        ],
        lightGray: [
          "text-white",
          "[--bg-color:#737373]",
          "[--bg-color-active:#525252]",
          "[--shadow-light:#a3a3a3]",
          "[--shadow-dark:#262626]",
          "[--led-color:#f59e0b]",
        ],
        white: [
          "text-black",
          "[--bg-color:#e5e5e5]",
          "[--bg-color-active:#cccccc]",
          "[--shadow-light:#ffffff]",
          "[--shadow-dark:#999999]",
          "[--led-color:#3b82f6]",
        ],
      },
      size: {
        default: "w-24 h-10",
        wide: "w-36 h-10",
        xwide: "w-44 h-12",
        auto: "w-auto min-w-[7rem] px-3 h-10",
        nav: "w-[180px] md:w-[202px] h-[68px] px-2 py-1",
        full: "w-full h-10 px-3",
        fullNav: "w-full h-[58px] px-2 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const retroButtonInnerVariants = cva(
  "w-full h-full flex flex-col items-center justify-center text-center rounded-[4.5%] border border-[#000000]/40 transition-all duration-100 bg-[var(--bg-color)] text-[11px] md:text-[12.5px] font-sans font-bold uppercase tracking-wider shadow-[inset_1.5px_1.5px_0.5px_var(--shadow-light),_inset_-1.5px_-1.5px_0.5px_var(--shadow-dark),_0px_2px_4px_rgba(0,0,0,0.5)] cursor-pointer select-none",
  {
    variants: {
      isActive: {
        true: "bg-[var(--bg-color-active)] shadow-[inset_-2px_-2px_1px_rgba(255,255,255,0.1),_inset_2px_2px_2px_rgba(0,0,0,0.9)] translate-y-[2px]",
        false: "active:bg-[var(--bg-color-active)] active:shadow-[inset_-2px_-2px_1px_rgba(255,255,255,0.1),_inset_2px_2px_2px_rgba(0,0,0,0.9)] active:translate-y-[2px]",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
)

export interface RetroButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
    VariantProps<typeof retroButtonVariants> {
  isActive?: boolean
  ledActive?: boolean
  asChild?: boolean
  children: React.ReactNode
}

const RetroButton = React.forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ className, variant, size, isActive = false, ledActive = false, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isLedLit = ledActive || isActive

    return (
      <Comp
        className={cn(retroButtonVariants({ variant, size, className }))}
        ref={ref}
        style={{ padding: "3px" }}
        {...props}
      >
        <span className={retroButtonInnerVariants({ isActive })}>
          {/* LED Indicator */}
          <span className="absolute top-[8px] right-[10px] flex h-[6px] w-[6px]">
            {isLedLit && (
              <span 
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: "var(--led-color)", filter: "blur(1px)" }}
              />
            )}
            <span 
              className={cn(
                "relative inline-flex rounded-full h-[6px] w-[6px] transition-all duration-300 border border-black/30",
                isLedLit ? "shadow-[0_0_8px_var(--led-color)]" : "opacity-40"
              )}
              style={{ 
                backgroundColor: isLedLit ? "var(--led-color)" : "#1e1e24",
                boxShadow: isLedLit ? "0 0 6px 1px var(--led-color), inset 1px 1px 0px rgba(255,255,255,0.4)" : "inset 1px 1px 1px rgba(0,0,0,0.8)" 
              }}
            />
          </span>
          
          {/* Text Content */}
          <span className={cn(
            "flex flex-col items-center justify-center leading-[1.2] px-1 transition-all duration-100",
            isActive ? "opacity-90 pt-[1px]" : "hover:scale-[1.02]"
          )}>
            {children}
          </span>
        </span>
      </Comp>
    )
  }
)
RetroButton.displayName = "RetroButton"

export { RetroButton }
