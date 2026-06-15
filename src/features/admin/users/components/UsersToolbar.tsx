import { RotateCcw, Search, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UsersFilters } from "../types"
import { defaultUsersFilters } from "../helpers"

interface UsersToolbarProps {
  filters: UsersFilters
  pageSize: number
  fetching: boolean
  onFiltersChange: (filters: UsersFilters) => void
  onPageSizeChange: (size: number) => void
  onRefresh: () => void
}

const pageSizes = [10, 20, 50]

export default function UsersToolbar({
  filters,
  pageSize,
  fetching,
  onFiltersChange,
  onPageSizeChange,
  onRefresh,
}: UsersToolbarProps) {
  const { t } = useTranslation()

  const updateFilters = (patch: Partial<UsersFilters>) => {
    onFiltersChange({ ...filters, ...patch })
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/80 p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
          <Select
            value={filters.searchField}
            onValueChange={(value) =>
              updateFilters({ searchField: value as UsersFilters["searchField"] })
            }
          >
            <SelectTrigger aria-label={t("admin.users.filters.searchField")} className="w-full sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name">{t("admin.users.filters.searchFields.name")}</SelectItem>
                <SelectItem value="email">{t("admin.users.filters.searchFields.email")}</SelectItem>
                <SelectItem value="id">{t("admin.users.filters.searchFields.id")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute start-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(event) => updateFilters({ search: event.target.value })}
              className="ps-8 pe-8"
              placeholder={t("admin.users.searchPlaceholder")}
              aria-label={t("admin.users.searchPlaceholder")}
            />
            {filters.search ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="absolute end-1 top-1/2 -translate-y-1/2"
                aria-label={t("admin.users.filters.clearSearch")}
                onClick={() => updateFilters({ search: "" })}
              >
                <X />
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select
            value={filters.status}
            onValueChange={(value) =>
              updateFilters({ status: value as UsersFilters["status"] })
            }
          >
            <SelectTrigger aria-label={t("admin.users.filters.status")} className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">{t("admin.users.filters.all")}</SelectItem>
                <SelectItem value="active">{t("admin.users.filters.active")}</SelectItem>
                <SelectItem value="banned">{t("admin.users.filters.banned")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={filters.deleted}
            onValueChange={(value) =>
              updateFilters({ deleted: value as UsersFilters["deleted"] })
            }
          >
            <SelectTrigger aria-label={t("admin.users.filters.deleted")} className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">{t("admin.users.filters.deletedAll")}</SelectItem>
                <SelectItem value="notDeleted">{t("admin.users.filters.notDeleted")}</SelectItem>
                <SelectItem value="deleted">{t("admin.users.filters.deletedOnly")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={filters.emailVerified}
            onValueChange={(value) =>
              updateFilters({ emailVerified: value as UsersFilters["emailVerified"] })
            }
          >
            <SelectTrigger aria-label={t("admin.users.filters.emailVerified")} className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">{t("admin.users.filters.emailAll")}</SelectItem>
                <SelectItem value="verified">{t("admin.users.filters.verified")}</SelectItem>
                <SelectItem value="unverified">{t("admin.users.filters.unverified")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger aria-label={t("admin.users.filters.pageSize")} className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pageSizes.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-xs font-medium text-muted-foreground">
          {t("admin.users.filters.hint")}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onFiltersChange(defaultUsersFilters)}
          >
            <X data-icon="inline-start" />
            {t("admin.users.filters.reset")}
          </Button>
          <Button type="button" variant="outline" onClick={onRefresh} disabled={fetching}>
            <RotateCcw data-icon="inline-start" />
            {t("admin.users.actions.refresh")}
          </Button>
        </div>
      </div>
    </div>
  )
}
