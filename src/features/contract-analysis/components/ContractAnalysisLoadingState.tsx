import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContractAnalysisLoadingState() {
    return (
        <Card className="border-blue-500/20 shadow-2xl shadow-blue-500/10">
            <CardHeader className="gap-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <Skeleton className="size-11 shrink-0 rounded-xl" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-8 w-64 max-w-full" />
                            <Skeleton className="h-4 w-80 max-w-full" />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-28 rounded-lg" />
                    <Skeleton className="h-9 w-32 rounded-lg" />
                </div>
                <section className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-5">
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-5 w-52 max-w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                    <div className="mt-6 grid gap-3 md:grid-cols-2">
                        <Skeleton className="h-24 rounded-xl" />
                        <Skeleton className="h-24 rounded-xl" />
                    </div>
                    <div className="mt-6 flex flex-col gap-3">
                        <Skeleton className="h-5 w-36" />
                        <Skeleton className="h-20 rounded-xl" />
                        <Skeleton className="h-20 rounded-xl" />
                    </div>
                </section>
            </CardContent>
        </Card>
    );
}
