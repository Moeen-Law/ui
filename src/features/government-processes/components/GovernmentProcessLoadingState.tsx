import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GovernmentProcessLoadingState() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-72 max-w-full" />
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <Skeleton className="h-24 rounded-xl" />
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                </div>
            </CardContent>
        </Card>
    );
}
