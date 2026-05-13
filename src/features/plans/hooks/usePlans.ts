import { useQuery } from "@tanstack/react-query"
import { getPlans } from "../services"



export const usePlans = () => {

    const { data: plans, isLoading, isError , error , refetch } = useQuery({
        queryKey: ["plans"],
        queryFn: getPlans,
    })

    return { plans, isLoading, isError, error, refetch }
}