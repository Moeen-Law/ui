import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PricingSkeleton() {
    return (
        <div
            aria-label="Loading pricing plans"
            className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12"
        >
            {Array.from({ length: 3 }, (_, index) => (
                <Card
                    key={index}
                    data-testid="pricing-skeleton-card"
                    className={cn(
                        "min-h-[460px] rounded-2xl border-border bg-card p-5",
                        index === 1 && "border-2 border-blue-500 shadow-[0_24px_55px_rgba(59,130,246,0.18)] lg:-translate-y-3"
                    )}
                >
                    <CardHeader className="gap-5 px-2 pt-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-3">
                                {index === 1 && <Skeleton className="h-5 w-24 rounded-full bg-blue-500/20" />}
                                <Skeleton className="h-8 w-32 rounded-lg" />
                                <Skeleton className="h-4 w-48 max-w-full rounded-md" />
                            </div>
                        </div>
                        <div className="flex items-end gap-2 pt-2">
                            <Skeleton className={cn("h-14 w-32 rounded-lg", index === 1 && "bg-blue-500/20")} />
                            <div className="flex flex-col gap-1 pb-1">
                                <Skeleton className="h-4 w-12 rounded-sm" />
                                <Skeleton className="h-3 w-16 rounded-sm" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6 px-2 py-4">
                        <Separator className="bg-border/60" />
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-6 shrink-0 rounded-full" />
                                <Skeleton className="h-4 w-full rounded-md" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-6 shrink-0 rounded-full" />
                                <Skeleton className="h-4 w-11/12 rounded-md" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-6 shrink-0 rounded-full" />
                                <Skeleton className="h-4 w-10/12 rounded-md" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="mt-auto bg-transparent px-2 pt-4">
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
