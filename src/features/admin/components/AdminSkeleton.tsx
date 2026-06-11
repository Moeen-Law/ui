import { Skeleton } from "@/components/ui/skeleton"
import { MoeenLogo } from "@/shared/components/MoeenLogo"

export default function AdminSkeleton() {
  return (
    <div className="admin-dashboard h-dvh overflow-hidden bg-background text-foreground">
      <div className="flex h-full min-h-0">
        <aside className="hidden h-full min-h-0 w-72 shrink-0 overflow-hidden border-e border-sidebar-border bg-sidebar md:flex md:flex-col">
          <div className="flex h-[88px] items-center px-5">
            <MoeenLogo size="sm" />
          </div>
          <div className="h-px bg-border" />
          <div className="admin-table-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-12 rounded-lg bg-sidebar-accent" />
            ))}
          </div>
          <div className="h-px bg-border" />
          <div className="p-4">
            <Skeleton className="h-12 rounded-lg bg-sidebar-accent" />
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-[88px] items-center justify-between border-b border-border px-5 md:px-10">
            <div className="flex items-center gap-4">
              <Skeleton className="size-9 rounded-lg" />
              <Skeleton className="h-8 w-36" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="size-9 rounded-lg" />
              <Skeleton className="hidden h-11 w-44 rounded-full sm:block" />
            </div>
          </header>

          <main className="flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto overflow-x-hidden p-5 md:p-10">
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-44 rounded-2xl" />
              ))}
            </section>

            <section className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)]">
              <Skeleton className="h-[430px] rounded-2xl" />
              <Skeleton className="h-[430px] rounded-2xl" />
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
