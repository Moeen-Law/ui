import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from './features/landing/pages/Landing';
import SignUp from './features/auth/pages/SignUp';
import Login from './features/auth/pages/Login';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import ResetPassword from './features/auth/pages/ResetPassword';
import VerifyEmail from './features/auth/pages/VerifyEmail';
import OAuthAuthorize from './features/auth/pages/OAuthAuthorize';
import NotFound from './shared/pages/NotFound';
import ChatSkeleton from "./features/chat/components/ChatSkeleton";

const Chat = lazy(() => import('./features/chat/pages/Chat'));
import { Toaster } from "@/components/ui/sonner"
import useAuthStore from "./features/auth/store/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./shared/components/ErrorBoundary";
import ProtectedRoute from "./routes/ProtectedRoute";


const queryClient = new QueryClient();

// adding the error boundary for the chat with custom error message
export function App() {
    const { accessToken } = useAuthStore();
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Toaster />
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/signup" element={accessToken ? <Navigate to="/" /> : <SignUp />} />
                    <Route path="/login" element={accessToken ? <Navigate to="/" /> : <Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/login/oauth/authorize" element={<OAuthAuthorize />} />


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
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    ); 
}

export default App;