import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TaskWorkspaceShellProps {
    header: ReactNode;
    mobileHistory: ReactNode;
    desktopHistory: ReactNode;
    children: ReactNode;
    sidebarWidth?: "340px" | "360px";
    backgroundClassName?: string;
}

export function TaskWorkspaceShell({
    header,
    mobileHistory,
    desktopHistory,
    children,
    sidebarWidth = "360px",
    backgroundClassName,
}: TaskWorkspaceShellProps) {
    return (
        <div className="min-h-dvh w-full overflow-x-clip bg-background text-foreground">
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.10),transparent_48%),radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.08),transparent_32%)]",
                    backgroundClassName
                )}
            />
            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 px-3 py-4 sm:px-4 md:gap-6 md:px-8 md:py-8">
                {header}
                <main
                    className={cn(
                        "grid min-w-0 grid-cols-1 gap-5 md:gap-6",
                        sidebarWidth === "340px"
                            ? "lg:grid-cols-[minmax(0,1fr)_340px]"
                            : "lg:grid-cols-[minmax(0,1fr)_360px]"
                    )}
                >
                    <section className="flex min-w-0 flex-col gap-5">
                        <div className="lg:hidden">{mobileHistory}</div>
                        {children}
                    </section>
                    <aside className="hidden min-w-0 lg:sticky lg:top-8 lg:block lg:self-start">
                        {desktopHistory}
                    </aside>
                </main>
            </div>
        </div>
    );
}
