import { Skeleton } from "@/components/ui/skeleton"

export default function AdminChatsPageSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-40 rounded-2xl" />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl" />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <Skeleton className="h-[430px] rounded-2xl" />
        <Skeleton className="h-[430px] rounded-2xl" />
      </section>
    </div>
  )
}
