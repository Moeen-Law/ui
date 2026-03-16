import { useSuspenseQuery } from "@tanstack/react-query"
import { fetchMe } from "../services"



export const useMe = () => {

    const {data: profile , isPending , isError} = useSuspenseQuery({
        queryKey: ["me"],
        queryFn: fetchMe,
        staleTime: 5 * 60 * 1000,
    })

    return { profile , isPending , isError }
}