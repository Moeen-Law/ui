import { useQuery } from "@tanstack/react-query";
import { userSessions } from "../services";

export const userSessionKeys = {
    all: ["auth", "sessions"] as const,
};

export const useUserSessions = (enabled = true) => {
    return useQuery({
        queryKey: userSessionKeys.all,
        queryFn: userSessions,
        enabled,
        staleTime: 30 * 1000,
    });
};
