import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { StuckPayment } from "../types"
import {
  formatCurrency,
  formatDateTime,
  formatMinutes,
  shortenPaymentId,
} from "../helpers"
import { useTranslation } from "react-i18next"

interface StuckPaymentsPanelProps {
  payments: StuckPayment[]
  locale: string
}

export default function StuckPaymentsPanel({
  payments,
  locale,
}: StuckPaymentsPanelProps) {
  const { t } = useTranslation()

  return (
    <Card className="h-full min-h-[430px] rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none">
      <CardHeader className="gap-2 px-6">
        <CardTitle className="text-xl font-black">
          {t("admin.payments.panels.stuck.title")}
        </CardTitle>
        <CardDescription>
          {t("admin.payments.panels.stuck.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="admin-table-scrollbar overflow-x-auto px-6">
        {payments.length > 0 ? (
          <table className="w-full min-w-[640px] text-start text-sm">
            <thead>
              <tr className="border-b border-border/70 text-xs text-muted-foreground">
                <th className="py-3 pe-4 text-start font-bold">
                  {t("admin.payments.panels.stuck.payment")}
                </th>
                <th className="py-3 pe-4 text-start font-bold">
                  {t("admin.payments.panels.stuck.user")}
                </th>
                <th className="py-3 pe-4 text-start font-bold">
                  {t("admin.payments.panels.stuck.amount")}
                </th>
                <th className="py-3 pe-4 text-start font-bold">
                  {t("admin.payments.panels.stuck.created")}
                </th>
                <th className="py-3 text-start font-bold">
                  {t("admin.payments.panels.stuck.duration")}
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.paymentId} className="border-b border-border/50 last:border-0">
                  <td className="py-4 pe-4 font-bold text-foreground">
                    {shortenPaymentId(payment.paymentId)}
                  </td>
                  <td className="py-4 pe-4 text-muted-foreground">
                    {shortenPaymentId(payment.userId)}
                  </td>
                  <td className="py-4 pe-4 font-bold text-foreground">
                    {formatCurrency(payment.amount, locale, payment.currency)}
                  </td>
                  <td className="py-4 pe-4 text-muted-foreground">
                    {formatDateTime(payment.createdAt, locale)}
                  </td>
                  <td className="py-4">
                    <Badge variant="destructive">
                      {formatMinutes(payment.minutesStuck, locale)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground">
            {t("admin.payments.empty.stuck")}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
