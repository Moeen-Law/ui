import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import AdminSkeleton from "@/features/admin/components/AdminSkeleton";
import { useMe } from "@/features/auth/hooks/useMe";
import useAuthStore from "@/features/auth/store/auth";
import { hasAdminRole } from "@/features/auth/helpers/roles";

interface AdminRouteProps {
    children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
    const { accessToken } = useAuthStore();
    const { profile, isPending, isError } = useMe({ enabled: Boolean(accessToken) });

    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    if (isPending) {
        return <AdminSkeleton />;
    }

    if (isError || !hasAdminRole(profile)) {
        return <Navigate to="/chat" replace />;
    }

    return children;
}
