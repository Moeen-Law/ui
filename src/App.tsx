import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './features/landing/pages/Landing';
import SignUp from './features/auth/pages/SignUp';
import Login from './features/auth/pages/Login';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import ResetPassword from './features/auth/pages/ResetPassword';
import VerifyEmail from './features/auth/pages/VerifyEmail';
import OAuthAuthorize from './features/auth/pages/OAuthAuthorize';
import NotFound from './shared/pages/NotFound';
import ChatSkeleton from "./features/chat/components/ChatSkeleton";
import AdminSkeleton from './features/admin/components/AdminSkeleton';

const Chat = lazy(() => import('./features/chat/pages/Chat')); 
const AdminLayout = lazy(() => import('./features/admin/layout/AdminLayout'));
const AdminOverview = lazy(() => import('./features/admin/overview/pages/AdminOverview'));
const AdminPlaceholder = lazy(() => import('./features/admin/pages/AdminPlaceholder'));
const AdminUsersPage = lazy(() => import('./features/admin/users/pages/AdminUsersPage'));
import { Toaster } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./shared/components/ErrorBoundary";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestOnlyRoute from "./routes/GuestOnlyRoute";

const queryClient = new QueryClient();

const guestOnly = (page: ReactNode) => (
    <GuestOnlyRoute>
        {page}
    </GuestOnlyRoute>
);

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Toaster />
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/signup" element={guestOnly(<SignUp />)} />
                    <Route path="/login" element={guestOnly(<Login />)} />
                    <Route path="/forgot-password" element={guestOnly(<ForgotPassword />)} />
                    <Route path="/reset-password" element={guestOnly(<ResetPassword />)} />
                    <Route path="/verify-email" element={guestOnly(<VerifyEmail />)} />
                    <Route path="/login/oauth/authorize" element={guestOnly(<OAuthAuthorize />)} />


                    <Route
                        path="/chat"
                        element={
                            <Suspense fallback={<ChatSkeleton />}>
                                <ErrorBoundary message="حدث خطأ ما أثناء تحميل المحادثات. يرجى المحاولة مرة أخرى.">
                                    <ProtectedRoute>
                                        <Chat />
                                    </ProtectedRoute>
                                </ErrorBoundary>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/chat/:chatId"
                        element={
                            <Suspense fallback={<ChatSkeleton />}>
                                <ErrorBoundary message="حدث خطأ ما أثناء تحميل المحادثات. يرجى المحاولة مرة أخرى.">
                                    <ProtectedRoute>
                                        <Chat />
                                    </ProtectedRoute>
                                </ErrorBoundary>
                            </Suspense>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <Suspense fallback={<AdminSkeleton />}>
                                <ErrorBoundary message="حدث خطأ ما أثناء تحميل لوحة التحكم. يرجى المحاولة مرة أخرى.">
                                    <ProtectedRoute>
                                        <AdminLayout />
                                    </ProtectedRoute>
                                </ErrorBoundary>
                            </Suspense>
                        }
                    >
                        <Route index element={<AdminOverview />} />
                        <Route path="users" element={<AdminUsersPage />} />
                        <Route path="contracts" element={<AdminPlaceholder titleKey="admin.nav.contracts" />} />
                        <Route path="subscriptions" element={<AdminPlaceholder titleKey="admin.nav.subscriptions" />} />
                        <Route path="ai-feeding" element={<AdminPlaceholder titleKey="admin.nav.aiFeeding" />} />
                        <Route path="settings" element={<AdminPlaceholder titleKey="admin.nav.settings" />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
