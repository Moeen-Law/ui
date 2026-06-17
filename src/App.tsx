import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatSkeleton from "./features/chat/components/ChatSkeleton";
import AdminSkeleton from './features/admin/components/AdminSkeleton';
import LegalTerminologySkeleton from './features/legal-terminologies/components/LegalTerminologySkeleton';
import GovernmentProcessSkeleton from './features/government-processes/components/GovernmentProcessSkeleton';
import ContractAnalysisSkeleton from './features/contract-analysis/components/ContractAnalysisSkeleton';
import DocumentGenerationSkeleton from './features/document-generation/components/DocumentGenerationSkeleton';

const Landing = lazy(() => import('./features/landing/pages/Landing'));
const SignUp = lazy(() => import('./features/auth/pages/SignUp'));
const Login = lazy(() => import('./features/auth/pages/Login'));
const ForgotPassword = lazy(() => import('./features/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./features/auth/pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./features/auth/pages/VerifyEmail'));
const OAuthAuthorize = lazy(() => import('./features/auth/pages/OAuthAuthorize'));
const PaymentResult = lazy(() => import('./features/plans/pages/PaymentResult'));
const Upgrade = lazy(() => import('./features/plans/pages/Upgrade'));
const NotFound = lazy(() => import('./shared/pages/NotFound'));
const Chat = lazy(() => import('./features/chat/pages/Chat')); 
const LegalTerminologies = lazy(() => import('./features/legal-terminologies/pages/LegalTerminologies'));
const GovernmentProcesses = lazy(() => import('./features/government-processes/pages/GovernmentProcesses'));
const ContractAnalysis = lazy(() => import('./features/contract-analysis/pages/ContractAnalysis'));
const DocumentGeneration = lazy(() => import('./features/document-generation/pages/DocumentGeneration'));
const AdminLayout = lazy(() => import('./features/admin/layout/AdminLayout'));
const AdminUsersPage = lazy(() => import('./features/admin/users/pages/AdminUsersPage'));
const AdminChatsPage = lazy(() => import('./features/admin/chats/pages/AdminChatsPage'));
const AdminPaymentsPage = lazy(() => import('./features/admin/payments/pages/AdminPaymentsPage'));
import { Toaster } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./shared/components/ErrorBoundary";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
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
                    <Route
                        path="/"
                        element={
                            <Suspense fallback={<div className="min-h-screen bg-background" />}>
                                <Landing />
                            </Suspense>
                        }
                    />
                    <Route path="/signup" element={guestOnly(<SignUp />)} />
                    <Route path="/login" element={guestOnly(<Login />)} />
                    <Route path="/forgot-password" element={guestOnly(<ForgotPassword />)} />
                    <Route path="/reset-password" element={guestOnly(<ResetPassword />)} />
                    <Route path="/verify-email" element={guestOnly(<VerifyEmail />)} />
                    <Route path="/login/oauth/authorize" element={guestOnly(<OAuthAuthorize />)} />
                    <Route
                        path="/payment-result"
                        element={
                            <Suspense fallback={<div className="min-h-screen bg-background" />}>
                                <PaymentResult />
                            </Suspense>
                        }
                    />

                    <Route
                        path="/upgrade"
                        element={
                            <Suspense fallback={<div className="min-h-screen bg-background" />}>
                                <ProtectedRoute>
                                    <Upgrade />
                                </ProtectedRoute>
                            </Suspense>
                        }
                    />


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
                                    <AdminRoute>
                                        <AdminLayout />
                                    </AdminRoute>
                                </ErrorBoundary>
                            </Suspense>
                        }
                    >
                        <Route index element={<AdminUsersPage />} />
                        <Route path="chats" element={<AdminChatsPage />} /> 
                        <Route path="subscriptions" element={<AdminPaymentsPage />} />
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
