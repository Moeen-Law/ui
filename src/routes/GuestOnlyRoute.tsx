import { getSafeRedirectTarget } from "@/features/auth/helpers/redirect";
import useAuthStore from "@/features/auth/store/auth";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface GuestOnlyRouteProps {
    children: ReactNode;
}

function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
    const { accessToken } = useAuthStore();
    const location = useLocation();

    if (accessToken) {
        const searchParams = new URLSearchParams(location.search);

        return (
            <Navigate
                to={getSafeRedirectTarget(searchParams.get("redirect"))}
                replace
            />
        );
    }

    return children;
}

export default GuestOnlyRoute;
