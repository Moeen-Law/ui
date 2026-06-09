import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

interface MoeenLogoProps {
  showText?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  iconClassName?: string
  textClassName?: string
}

const iconSizes = {
  sm: "size-9",
  md: "size-12",
  lg: "size-24",
}

const textSizes = {
  sm: "text-xl",
  md: "text-[1.75rem]",
  lg: "text-5xl",
}

export function MoeenLogo({
  showText = true,
  size = "md",
  className,
  iconClassName,
  textClassName,
}: MoeenLogoProps) {
  const { t } = useTranslation()

  return (
    <div className={cn("flex items-center gap-3.5", className)}>
      <svg
        className={cn(
          "shrink-0 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105",
          iconSizes[size],
          iconClassName
        )}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
      </svg>
      {showText && (
        <span
          className={cn(
            "truncate font-sans font-black tracking-tight text-foreground",
            textSizes[size],
            textClassName
          )}
        >
          {t("nav.logo")}
        </span>
      )}
    </div>
  )
}
