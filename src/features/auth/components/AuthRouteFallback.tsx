

export default function AuthRouteFallback() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="mx-auto flex min-h-[650px] w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card/80 shadow-2xl">
                <div className="flex flex-1 flex-col justify-center p-8 md:p-14">
                    <div className="mb-10 flex flex-col gap-3">
                        <div className="h-10 w-64 max-w-full animate-pulse rounded-lg bg-muted" />
                        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="h-12 animate-pulse rounded-xl bg-muted" />
                        <div className="h-12 animate-pulse rounded-xl bg-muted" />
                        <div className="h-12 animate-pulse rounded-xl bg-muted" />
                    </div>
                </div>
                <div className="hidden flex-1 border-s border-border bg-muted md:block" />
            </div>
        </div>
    );
}
