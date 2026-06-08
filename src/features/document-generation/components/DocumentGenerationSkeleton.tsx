import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentGenerationSkeleton() {
    return (
        <div className="min-h-dvh bg-background p-4 text-foreground md:p-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="flex flex-col gap-5">
                        <Skeleton className="h-80 w-full rounded-2xl" />
                        <Skeleton className="h-64 w-full rounded-2xl" />
                    </div>
                    <Skeleton className="hidden h-[520px] rounded-2xl lg:block" />
                </div>
            </div>
        </div>
    );
}
