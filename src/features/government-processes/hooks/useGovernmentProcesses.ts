import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getAllGovernmentProcess } from "../services";
import type {
    AllGovernmentProcessesRes,
    FetchGovernmentProcessesParams,
} from "../types";
import { governmentProcessKeys } from "./queryKeys";

const DEFAULT_PAGE_SIZE = 5;

export const useGovernmentProcesses = ({
    size = DEFAULT_PAGE_SIZE,
    sortOrder = "DESC",
}: FetchGovernmentProcessesParams = {}) => {
    const params = { size, sortOrder };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
        refetch,
    } = useSuspenseInfiniteQuery<AllGovernmentProcessesRes>({
        queryKey: governmentProcessKeys.list(params),
        queryFn: ({ pageParam = 1 }) =>
            getAllGovernmentProcess({
                page: pageParam as number,
                size,
                sortOrder,
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { page, totalPages, hasNextPage } = lastPage.meta;
            return hasNextPage || page < totalPages ? page + 1 : undefined;
        },
    });

    const processes = data.pages.flatMap((page) => page.data);
    const meta = data.pages[0]?.meta;

    return {
        processes,
        meta,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
        refetch,
    };
};
