import { Skeleton } from "@/components/ui/skeleton";

export default function LegalTerminologySkeleton() {
    return (
        <div className="min-h-dvh bg-background text-foreground">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_48%),radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.08),transparent_32%)]" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-8 w-56" />
                        <Skeleton className="h-4 w-80 max-w-full" />
                    </div>
                    <Skeleton className="size-9 rounded-lg" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="flex flex-col gap-5">
                        <Skeleton className="h-44 rounded-2xl" />
                        <Skeleton className="h-[420px] rounded-2xl" />
                    </div>
                    <Skeleton className="h-[620px] rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
