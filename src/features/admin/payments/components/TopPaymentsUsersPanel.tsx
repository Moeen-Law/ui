import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { PaymentTopUser } from "../types"
import { formatCurrency, formatNumber } from "../helpers"
import { useTranslation } from "react-i18next"
import PaymentUserIdentity from "./PaymentUserIdentity"

interface TopPaymentsUsersPanelProps {
  users: PaymentTopUser[]
  currency: string
  locale: string
}

export default function TopPaymentsUsersPanel({
  users,
  currency,
  locale,
}: TopPaymentsUsersPanelProps) {
  const { t } = useTranslation()

  return (
    <Card className="h-full min-h-[430px] rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none">
      <CardHeader className="gap-2 px-6">
        <CardTitle className="text-xl font-black">
          {t("admin.payments.panels.topUsers.title")}
        </CardTitle>
        <CardDescription>
          {t("admin.payments.panels.topUsers.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-6">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div
              key={user.userId}
              className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-background/45 p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Badge variant="secondary" className="size-7 shrink-0 justify-center rounded-full px-0">
                  {index + 1}
                </Badge>
                <div className="min-w-0">
                  <PaymentUserIdentity userId={user.userId} />
                  <p className="text-xs text-muted-foreground">
                    {t("admin.payments.panels.topUsers.payments", {
                      count: formatNumber(user.paymentCount, locale),
                    })}
                  </p>
                </div>
              </div>
              <p className="shrink-0 text-sm font-black text-foreground">
                {formatCurrency(user.totalSpent, locale, currency, true)}
              </p>
            </div>
          ))
        ) : (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground">
            {t("admin.payments.empty.topUsers")}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
