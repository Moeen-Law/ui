import { useTheme } from "next-themes"
import { useLocation } from "react-router-dom"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"
import type { CSSProperties } from "react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith("/admin")

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={isAdminRoute ? "toaster group admin-dashboard" : "toaster group"}
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-primary" />
        ),
        info: (
          <InfoIcon className="size-4 text-primary" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-[var(--admin-chart-amber,var(--chart-1))]" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-primary" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: isAdminRoute
            ? "cn-toast border-border/80 bg-popover/95 text-popover-foreground shadow-[0_18px_60px_var(--admin-glow)] backdrop-blur supports-[backdrop-filter]:bg-popover/90"
            : "cn-toast",
          success: isAdminRoute ? "border-primary/35" : undefined,
          info: isAdminRoute ? "border-primary/35" : undefined,
          warning: isAdminRoute
            ? "border-[color-mix(in_oklch,var(--admin-chart-amber,var(--chart-1))_45%,transparent)]"
            : undefined,
          error: isAdminRoute ? "border-destructive/35" : undefined,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
