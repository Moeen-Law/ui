import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ActivityItemData } from "@/features/admin/types"
import ActivityItem from "./ActivityItem"


interface ActivityFeedProps {
  items: ActivityItemData[]
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  const { t } = useTranslation()

  return (
    <Card className="h-full min-h-[430px] rounded-2xl border border-border/80 bg-card/80 py-7 shadow-none ring-0 transition-colors duration-300 hover:border-emerald-400/25">
      <CardHeader className="px-7">
        <CardTitle className="text-end text-2xl font-black">
          {t("admin.overview.activities.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 px-7 pt-6">
        {items.map((item) => (
          <ActivityItem key={item.id} item={item} />
        ))}
      </CardContent>
    </Card>
  )
}

