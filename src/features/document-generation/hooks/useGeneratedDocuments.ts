import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGeneratedDocuments } from "../services";
import type {
    FetchGeneratedDocumentsParams,
    GeneratedDocumentsResponse,
} from "../types";
import { documentGenerationKeys } from "./queryKeys";

const DEFAULT_PAGE_SIZE = 5;

export const useGeneratedDocuments = ({
    size = DEFAULT_PAGE_SIZE,
    sortOrder = "DESC",
}: FetchGeneratedDocumentsParams = {}) => {
    const params = { size, sortOrder };
    const query = useInfiniteQuery<GeneratedDocumentsResponse>({
        queryKey: documentGenerationKeys.documentsList(params),
        queryFn: ({ pageParam = 1 }) =>
            fetchGeneratedDocuments({
                page: pageParam as number,
                size,
                sortOrder,
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (!lastPage.meta) return undefined;

            const { page, totalPages, hasNextPage } = lastPage.meta;
            return hasNextPage || page < totalPages ? page + 1 : undefined;
        },
    });

    return {
        documents: query.data?.pages.flatMap((page) => page.data) ?? [],
        meta: query.data?.pages[0]?.meta,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isLoading: query.isLoading,
        isFetchingNextPage: query.isFetchingNextPage,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
};
