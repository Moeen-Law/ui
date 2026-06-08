import { Skeleton } from "@/components/ui/skeleton";

export default function ContractAnalysisSkeleton() {
    return (
        <div className="min-h-dvh bg-background px-3 py-4 sm:px-4 md:px-8 md:py-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
                <Skeleton className="h-56 w-full rounded-2xl" />
                <div className="grid gap-5 lg:grid-cols-[minmax(0,420px)_1fr]">
                    <Skeleton className="h-96 w-full rounded-2xl" />
                    <Skeleton className="h-96 w-full rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
