export default function MessagesSkeleton() {
    return (
        <div className="space-y-6 w-full relative">
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className={`flex items-start ${i % 2 === 0 ? "flex-row-reverse" : "flex-row"}`}
                >
                    <div
                        className={`max-w-[70%] md:max-w-[60%] p-4 rounded-2xl h-16 bg-muted/50 border border-border w-full animate-pulse`}
                        style={{ opacity: 1 - (i * 0.15) }}
                    />
                </div>
            ))}
        </div>
    );
}
