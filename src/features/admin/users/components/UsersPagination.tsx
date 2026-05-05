import { useTranslation } from "react-i18next"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface UsersPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function UsersPagination({
  page,
  totalPages,
  onPageChange,
}: UsersPaginationProps) {
  const { t } = useTranslation()

  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  const showEllipsis = totalPages > 4
  const visiblePages = showEllipsis ? pages.slice(0, 3) : pages

  return (
    <Pagination className="mx-0 justify-start">
      <PaginationContent className="gap-2">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            text={t("admin.users.pagination.previous")}
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-50" : undefined}
            onClick={(event) => {
              event.preventDefault()
              onPageChange(Math.max(1, page - 1))
            }}
          />
        </PaginationItem>
        {visiblePages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href="#"
              isActive={pageNumber === page}
              onClick={(event) => {
                event.preventDefault()
                onPageChange(pageNumber)
              }}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        {showEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            text={t("admin.users.pagination.next")}
            aria-disabled={page === totalPages}
            className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
            onClick={(event) => {
              event.preventDefault()
              onPageChange(Math.min(totalPages, page + 1))
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
