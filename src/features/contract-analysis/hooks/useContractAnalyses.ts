import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchContractAnalyses } from "../services";
import type {
    ContractAnalysisListResponse,
    FetchContractAnalysesParams,
} from "../types";
import { contractAnalysisKeys } from "./queryKeys";

const DEFAULT_PAGE_SIZE = 5;

export const useContractAnalyses = ({
    size = DEFAULT_PAGE_SIZE,
    sortOrder = "DESC",
}: FetchContractAnalysesParams = {}) => {
    const params = { size, sortOrder };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        isError,
        refetch,
    } = useInfiniteQuery<ContractAnalysisListResponse>({
        queryKey: contractAnalysisKeys.list(params),
        queryFn: ({ pageParam = 1 }) =>
            fetchContractAnalyses({
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

    const analyses = data?.pages.flatMap((page) => page.data) ?? [];
    const meta = data?.pages[0]?.meta;

    return {
        analyses,
        meta,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        isError,
        refetch,
    };
};
