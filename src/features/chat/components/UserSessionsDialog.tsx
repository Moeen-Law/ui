import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useLogoutAllSessions } from "@/features/auth/hooks/useLogoutAllSessions";
import { useLogoutSession } from "@/features/auth/hooks/useLogoutSession";
import { useUserSessions } from "@/features/auth/hooks/useUserSessions";
import { AlertTriangle, Loader2, LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SessionCard } from "./user-sessions/SessionCard";

interface UserSessionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UserSessionsDialog({ open, onOpenChange }: UserSessionsDialogProps) {
    const { t } = useTranslation();
    const { data: sessions = [], isLoading, isError, refetch } = useUserSessions(open);
    const logoutSession = useLogoutSession();
    const logoutAllSessions = useLogoutAllSessions();
    const [confirmLogoutAll, setConfirmLogoutAll] = useState(false);

    const activeLogoutSessionId = logoutSession.variables;

    const handleLogoutAll = () => {
        if (!confirmLogoutAll) {
            setConfirmLogoutAll(true);
            return;
        }

        logoutAllSessions.mutate();
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setConfirmLogoutAll(false);
        }

        onOpenChange(nextOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[calc(100vh-2rem)] overflow-hidden rounded-[28px] border border-border bg-background p-0 shadow-2xl sm:max-w-2xl">
                <DialogHeader className="border-b border-border bg-muted/40 p-6 pe-14">
                    <div className="flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-500 shadow-[0_0_24px_rgba(59,130,246,0.12)]">
                            <ShieldCheck className="size-6" />
                        </div>
                        <div className="space-y-2 text-start">
                            <DialogTitle className="font-sans text-2xl font-black text-foreground">
                                {t("auth.sessions.title")}
                            </DialogTitle>
                            <DialogDescription className="font-sans leading-6">
                                {t("auth.sessions.description")}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="session-dialog-scrollbar max-h-[52vh] overflow-y-auto p-5 pe-3 md:p-6 md:pe-4">
                    {isLoading && (
                        <div className="flex min-h-44 flex-col items-center justify-center gap-3 text-muted-foreground">
                            <Loader2 className="size-6 animate-spin" />
                            <span className="font-sans text-sm font-bold">
                                {t("auth.sessions.loading")}
                            </span>
                        </div>
                    )}

                    {isError && (
                        <div className="flex min-h-44 flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-6 text-center">
                            <AlertTriangle className="size-8 text-red-500" />
                            <p className="font-sans text-sm font-bold text-muted-foreground">
                                {t("auth.sessions.error")}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer font-sans font-bold"
                                onClick={() => refetch()}
                            >
                                {t("auth.sessions.retry")}
                            </Button>
                        </div>
                    )}

                    {!isLoading && !isError && sessions.length === 0 && (
                        <div className="flex min-h-44 items-center justify-center rounded-2xl border border-border bg-card p-6 text-center">
                            <p className="font-sans text-sm font-bold text-muted-foreground">
                                {t("auth.sessions.empty")}
                            </p>
                        </div>
                    )}

                    {!isLoading && !isError && sessions.length > 0 && (
                        <div className="space-y-3">
                            {sessions.map((session) => (
                                <SessionCard
                                    key={session.sessionId}
                                    session={session}
                                    isLoggingOut={
                                        logoutSession.isPending &&
                                        activeLogoutSessionId === session.sessionId
                                    }
                                    onLogout={(id) => logoutSession.mutate(id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="m-0 flex-col gap-3 rounded-none border-t border-border bg-muted/40 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-sans text-xs leading-5 text-muted-foreground">
                        {confirmLogoutAll
                            ? t("auth.sessions.logoutAllConfirmHint")
                            : t("auth.sessions.footerHint")}
                    </p>
                    <Button
                        type="button"
                        variant="destructive"
                        className="w-full cursor-pointer rounded-xl font-sans font-bold sm:w-auto"
                        disabled={logoutAllSessions.isPending || sessions.length === 0}
                        onClick={handleLogoutAll}
                    >
                        {logoutAllSessions.isPending ? (
                            <Loader2 data-icon="inline-start" className="animate-spin" />
                        ) : (
                            <LogOut data-icon="inline-start" />
                        )}
                        {confirmLogoutAll
                            ? t("auth.sessions.confirmLogoutAll")
                            : t("auth.sessions.logoutAll")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
