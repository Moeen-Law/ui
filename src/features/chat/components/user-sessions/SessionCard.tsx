import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { userSessionRes } from "@/features/auth/types";
import { Globe2, Loader2, LogOut, Monitor, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatLoginDate, getSessionValue } from "./helpers";

interface SessionCardProps {
    session: userSessionRes;
    onLogout: (id: string) => void;
    isLoggingOut: boolean;
}

export function SessionCard({ session, onLogout, isLoggingOut }: SessionCardProps) {
    const { t } = useTranslation();
    const device = [
        getSessionValue(session.browser, t("auth.sessions.unknownBrowser")),
        getSessionValue(session.os, t("auth.sessions.unknownOs")),
    ].join(" / ");

    return (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-blue-500/30 hover:bg-muted/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-500">
                        <Monitor className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate font-sans text-sm font-black text-foreground">
                                {device}
                            </h3>
                            {session.current && (
                                <Badge className="border-blue-500/20 bg-blue-500/10 font-sans text-blue-500">
                                    <ShieldCheck data-icon="inline-start" />
                                    {t("auth.sessions.current")}
                                </Badge>
                            )}
                        </div>
                        <div className="mt-3 grid gap-2 font-sans text-xs leading-5 text-muted-foreground">
                            <span className="inline-flex min-w-0 items-center gap-2">
                                <Globe2 className="size-3.5 shrink-0 text-amber-400" />
                                <span className="truncate">
                                    {getSessionValue(session.location, t("auth.sessions.unknownLocation"))}
                                </span>
                            </span>
                            <span>
                                {t("auth.sessions.ipAddress", {
                                    ip: getSessionValue(session.ipAddress, t("auth.sessions.unknownIp")),
                                })}
                            </span>
                            <span>
                                {t("auth.sessions.loginAt", {
                                    date: formatLoginDate(session.loginAt),
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {!session.current && (
                    <Button
                        type="button"
                        variant="destructive"
                        className="w-full cursor-pointer rounded-xl font-sans font-bold sm:w-auto"
                        disabled={isLoggingOut}
                        onClick={() => onLogout(session.sessionId)}
                    >
                        {isLoggingOut ? (
                            <Loader2 data-icon="inline-start" className="animate-spin" />
                        ) : (
                            <LogOut data-icon="inline-start" />
                        )}
                        {t("auth.sessions.logoutSession")}
                    </Button>
                )}
            </div>
        </div>
    );
}
