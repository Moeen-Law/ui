import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './features/landing/pages/Landing';
import ChatSkeleton from "./features/chat/components/ChatSkeleton";
import AdminSkeleton from './features/admin/components/AdminSkeleton';
import LegalTerminologySkeleton from './features/legal-terminologies/components/LegalTerminologySkeleton';
import GovernmentProcessSkeleton from './features/government-processes/components/GovernmentProcessSkeleton';
import ContractAnalysisSkeleton from './features/contract-analysis/components/ContractAnalysisSkeleton';
import DocumentGenerationSkeleton from './features/document-generation/components/DocumentGenerationSkeleton';

const SignUp = lazy(() => import('./features/auth/pages/SignUp'));
const Login = lazy(() => import('./features/auth/pages/Login'));
const ForgotPassword = lazy(() => import('./features/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./features/auth/pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./features/auth/pages/VerifyEmail'));
const OAuthAuthorize = lazy(() => import('./features/auth/pages/OAuthAuthorize'));
const NotFound = lazy(() => import('./shared/pages/NotFound'));
const Chat = lazy(() => import('./features/chat/pages/Chat')); 
const LegalTerminologies = lazy(() => import('./features/legal-terminologies/pages/LegalTerminologies'));
const GovernmentProcesses = lazy(() => import('./features/government-processes/pages/GovernmentProcesses'));
const ContractAnalysis = lazy(() => import('./features/contract-analysis/pages/ContractAnalysis'));
const DocumentGeneration = lazy(() => import('./features/document-generation/pages/DocumentGeneration'));
const AdminLayout = lazy(() => import('./features/admin/layout/AdminLayout'));
const AdminOverview = lazy(() => import('./features/admin/overview/pages/AdminOverview'));
const AdminPlaceholder = lazy(() => import('./features/admin/pages/AdminPlaceholder'));
const AdminUsersPage = lazy(() => import('./features/admin/users/pages/AdminUsersPage'));
const AdminChatsPage = lazy(() => import('./features/admin/chats/pages/AdminChatsPage'));
import { Toaster } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./shared/components/ErrorBoundary";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestOnlyRoute from "./routes/GuestOnlyRoute";
import AuthRouteFallback from "./features/auth/components/AuthRouteFallback";

const queryClient = new QueryClient();



const guestOnly = (page: ReactNode) => (
    <GuestOnlyRoute>
        <Suspense fallback={<AuthRouteFallback />}>
            {page}
        </Suspense>
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
                        path="/legal-terminologies"
                        element={
                            <Suspense fallback={<LegalTerminologySkeleton />}>
                                <ProtectedRoute>
                                    <LegalTerminologies />
                                </ProtectedRoute>
                            </Suspense>
                        } 
                    />

                    <Route
                        path="/government-processes"
                        element={
                            <Suspense fallback={<GovernmentProcessSkeleton />}>
                                <ProtectedRoute>
                                    <GovernmentProcesses />
                                </ProtectedRoute>
                            </Suspense>
                        }
                    />

                    <Route
                        path="/contract-analysis"
                        element={
                            <Suspense fallback={<ContractAnalysisSkeleton />}>
                                <ProtectedRoute>
                                    <ContractAnalysis />
                                </ProtectedRoute>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/contract-analysis/:analysisId"
                        element={
                            <Suspense fallback={<ContractAnalysisSkeleton />}>
                                <ProtectedRoute>
                                    <ContractAnalysis />
                                </ProtectedRoute>
                            </Suspense>
                        }
                    />

                    <Route
                        path="/document-generation"
                        element={
                            <Suspense fallback={<DocumentGenerationSkeleton />}>
                                <ProtectedRoute>
                                    <DocumentGeneration />
                                </ProtectedRoute>
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
                        <Route path="chats" element={<AdminChatsPage />} />
                        <Route path="contracts" element={<AdminPlaceholder titleKey="admin.nav.contracts" />} />
                        <Route path="subscriptions" element={<AdminPlaceholder titleKey="admin.nav.subscriptions" />} />
                        <Route path="ai-feeding" element={<AdminPlaceholder titleKey="admin.nav.aiFeeding" />} />
                        <Route path="settings" element={<AdminPlaceholder titleKey="admin.nav.settings" />} />
                    </Route>

                    <Route
                        path="*"
                        element={
                            <Suspense fallback={<div className="min-h-screen bg-background" />}>
                                <NotFound />
                            </Suspense>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
