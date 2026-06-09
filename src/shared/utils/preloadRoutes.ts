const routePreloaders: Record<string, () => Promise<unknown>> = {
    "/": () => import("@/features/landing/pages/Landing"),
    "/login": () => import("@/features/auth/pages/Login"),
    "/signup": () => import("@/features/auth/pages/SignUp"),
    "/chat": () => import("@/features/chat/pages/Chat"),
    "/legal-terminologies": () => import("@/features/legal-terminologies/pages/LegalTerminologies"),
    "/government-processes": () => import("@/features/government-processes/pages/GovernmentProcesses"),
    "/contract-analysis": () => import("@/features/contract-analysis/pages/ContractAnalysis"),
    "/document-generation": () => import("@/features/document-generation/pages/DocumentGeneration"),
    "/admin": () => import("@/features/admin/layout/AdminLayout"),
};

const preloadedRoutes = new Set<string>();
const toolRoutes = [
    "/chat",
    "/legal-terminologies",
    "/government-processes",
    "/contract-analysis",
    "/document-generation",
];

export const preloadRoute = (href: string) => {
    const route = href === "/" ? href : `/${href.split("?")[0].split("#")[0].split("/").filter(Boolean).join("/")}`;
    const preload = routePreloaders[route];

    if (!preload || preloadedRoutes.has(route)) {
        return;
    }

    preloadedRoutes.add(route);
    void preload().catch(() => {
        preloadedRoutes.delete(route);
    });
};

export const preloadToolRoutes = () => {
    toolRoutes.forEach(preloadRoute);
};
