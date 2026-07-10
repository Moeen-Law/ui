import { useEffect, useRef } from "react";

export function useSidebarPagination(hasNextPage: boolean, isFetching: boolean, fetchNextPage: () => Promise<unknown>) {
    const loadMoreRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting && hasNextPage && !isFetching) void fetchNextPage();
        }, { threshold: 0.1 });
        const target = loadMoreRef.current;
        if (target) observer.observe(target);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetching]);
    return loadMoreRef;
}
