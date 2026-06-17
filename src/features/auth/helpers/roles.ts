import type { ProfileResponse } from "../types";

export const ADMIN_ROLE = "ADMIN";

const normalizeRole = (role: string) => role.trim().toUpperCase();

export const hasAdminRole = (profile: ProfileResponse | undefined) =>
    profile?.roles?.some((role) => normalizeRole(role) === ADMIN_ROLE) ?? false;
