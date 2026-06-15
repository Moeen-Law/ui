import { useTranslation } from "react-i18next"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { formatNumber } from "../helpers"

interface UsersPaginationProps {
  page: number
  totalPages: number
  totalElements: number
  locale: string
  disabled: boolean
  onPageChange: (page: number) => void
}

export default function UsersPagination({
  page,
  totalPages,
  totalElements,
  locale,
  disabled,
  onPageChange,
}: UsersPaginationProps) {
  const { t } = useTranslation()
  const canGoPrevious = page > 0 && !disabled
  const canGoNext = page + 1 < totalPages && !disabled

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/80 p-4 sm:flex-row">
      <p className="text-sm font-medium text-muted-foreground">
        {t("admin.users.pagination.summary", {
          page: formatNumber(totalPages > 0 ? page + 1 : 0, locale),
          totalPages: formatNumber(totalPages, locale),
          totalElements: formatNumber(totalElements, locale),
        })}
      </p>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text={t("admin.users.pagination.previous")}
              aria-disabled={!canGoPrevious}
              tabIndex={canGoPrevious ? undefined : -1}
              className={
                canGoPrevious
                  ? "cursor-pointer"
                  : "pointer-events-none cursor-not-allowed opacity-50"
              }
              onClick={(event) => {
                event.preventDefault()
                if (canGoPrevious) {
                  onPageChange(page - 1)
                }
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              text={t("admin.users.pagination.next")}
              aria-disabled={!canGoNext}
              tabIndex={canGoNext ? undefined : -1}
              className={
                canGoNext
                  ? "cursor-pointer"
                  : "pointer-events-none cursor-not-allowed opacity-50"
              }
              onClick={(event) => {
                event.preventDefault()
                if (canGoNext) {
                  onPageChange(page + 1)
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
