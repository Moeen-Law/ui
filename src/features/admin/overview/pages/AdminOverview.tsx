import ActivityFeed from "../components/ActivityFeed"
import MetricCard from "../components/MetricCard"
import UsageChart from "../components/UsageChart"
import {
  overviewActivities,
  overviewMetrics,
  weeklyUsageData,
} from "../data/mockOverview"

export default function AdminOverview() {
  return (
    <div className="flex flex-col gap-10">
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {overviewMetrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)]">
        <div>
          <UsageChart data={weeklyUsageData} />
        </div>
        <div>
          <ActivityFeed items={overviewActivities} />
        </div>
      </section>
    </div>
  )
}
