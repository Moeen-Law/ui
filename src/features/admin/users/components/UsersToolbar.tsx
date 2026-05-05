import { Search } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UserStatusFilter } from "../types"

interface UsersToolbarProps {
  search: string
  status: UserStatusFilter
  onSearchChange: (value: string) => void
  onStatusChange: (value: UserStatusFilter) => void
}

export default function UsersToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: UsersToolbarProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
      <div className="relative w-full md:max-w-sm">
        <Search className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("admin.users.searchPlaceholder")}
          className="h-12 rounded-xl bg-muted/30 ps-10 text-start"
        />
      </div>

      <Select value={status} onValueChange={(value) => onStatusChange(value as UserStatusFilter)}>
        <SelectTrigger className="h-12 w-full justify-between rounded-xl bg-muted/30 md:w-48">
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
    </div>
  )
}
