export const AUTH_REDIRECT_STORAGE_KEY = "auth-redirect-target";

export const PRICING_REDIRECT_TARGET = "/#pricing";

export const getSafeRedirectTarget = (redirect: string | null | undefined) => {
    if (!redirect) {
        return "/";
    }

    if (!redirect.startsWith("/") || redirect.startsWith("//")) {
        return "/";
    }

    return redirect;
};
