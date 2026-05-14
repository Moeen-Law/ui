import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { fetchLegalTerminologies } from "../services";
import type {
    FetchLegalTerminologiesParams,
    GetAllTerminologiesResponse,
} from "../types";
import { legalTerminologyKeys } from "./queryKeys";

const DEFAULT_PAGE_SIZE = 5;

export const useLegalTerminologies = ({
    size = DEFAULT_PAGE_SIZE,
    sortOrder = "DESC",
}: FetchLegalTerminologiesParams = {}) => {
    const params = { size, sortOrder };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
        refetch,
    } = useSuspenseInfiniteQuery<GetAllTerminologiesResponse>({
        queryKey: legalTerminologyKeys.list(params),
        queryFn: ({ pageParam = 1 }) =>
            fetchLegalTerminologies({
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

    const terminologies = data.pages.flatMap((page) => page.data);
    const meta = data.pages[0]?.meta;

    return {
        terminologies,
        meta,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
        refetch,
    };
};
