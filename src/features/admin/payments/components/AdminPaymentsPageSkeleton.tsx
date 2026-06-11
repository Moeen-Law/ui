import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPaymentsPageSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-40 rounded-2xl" />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl" />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <Skeleton className="h-[500px] rounded-2xl" />
        <Skeleton className="h-[430px] rounded-2xl" />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-[430px] rounded-2xl" />
        <Skeleton className="h-[430px] rounded-2xl" />
      </section>
    </div>
  )
}
