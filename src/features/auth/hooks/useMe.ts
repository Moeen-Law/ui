import { useQuery } from "@tanstack/react-query"
import { fetchMe } from "../services"


interface UseMeOptions {
    enabled?: boolean;
}

export const useMe = ({ enabled = true }: UseMeOptions = {}) => {

    const {data: profile , isPending , isError} = useQuery({
        queryKey: ["me"],
        queryFn: fetchMe,
        enabled,
        staleTime: 5 * 60 * 1000,
    })

    return { profile , isPending , isError }
}
