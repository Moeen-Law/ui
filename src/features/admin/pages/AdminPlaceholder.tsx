import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AdminPlaceholderProps {
  titleKey: string
}

export default function AdminPlaceholder({ titleKey }: AdminPlaceholderProps) {
  const { t } = useTranslation()

  return (
    <Card className="rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none ring-0">
      <CardHeader>
        <CardTitle className="text-2xl font-black">{t(titleKey)}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{t("admin.placeholder")}</p>
      </CardContent>
    </Card>
  )
}
