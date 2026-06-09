import { MessageSquare } from "lucide-react";

export default function ChatSkeleton() {
    return (
        <div className="flex h-dvh bg-background text-foreground font-sans overflow-hidden">
            {/* Sidebar Skeleton */}
            <aside className="hidden md:flex flex-col w-[300px] bg-muted border-e border-border p-5">
                <div className="h-6 w-32 bg-muted-foreground/20 rounded-md mb-8 animate-pulse" />
                <div className="h-12 w-full bg-muted/50 border border-border rounded-lg mb-8 animate-pulse" />

                <div className="flex-1 space-y-4">
                    <div className="h-3 w-20 bg-muted-foreground/20 rounded mb-4 animate-pulse" />
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 w-full bg-muted/50 rounded-lg animate-pulse" />
                    ))}
                </div>

                <div className="mt-auto pt-5 border-t border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted-foreground/20 animate-pulse" />
                    <div className="h-4 w-20 bg-muted-foreground/20 rounded animate-pulse" />
                </div>
            </aside>

            {/* Main Content Skeleton */}
            <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
                {/* Header Skeleton */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background">
                    <div className="h-5 w-20 bg-muted-foreground/20 rounded animate-pulse" />
                    <div className="h-5 w-5 bg-muted-foreground/20 rounded animate-pulse" />
                </div>

                <div className="flex-1 relative overflow-hidden flex flex-col">
                    {/* Messages Skeleton */}
                    <div className="flex-1 overflow-y-auto pt-4 md:pt-8 pb-40 md:pb-48 space-y-6 px-4 md:px-8 max-w-4xl mx-auto w-full">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`flex items-start ${i % 2 === 0 ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`max-w-[70%] md:max-w-[60%] p-4 rounded-2xl h-16 bg-muted/50 border border-border w-full animate-pulse opacity-${100 - (i * 20)}`} />
                            </div>
                        ))}

                        {/* Centered Logo/Icon placeholder */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                        </div>
                    </div>

                    {/* Input Skeleton */}
                    <div className="absolute inset-x-0 bottom-0 w-full bg-linear-to-t from-background via-background/90 to-transparent pt-10 pb-4 md:pb-8 px-4 md:px-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="h-[60px] w-full bg-card border border-border rounded-2xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
