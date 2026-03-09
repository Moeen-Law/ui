import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from './features/landing/pages/Landing';
import Chat from './features/chat/pages/Chat';
import SignUp from './features/auth/pages/SignUp';
import Login from './features/auth/pages/Login';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import ResetPassword from './features/auth/pages/ResetPassword';
import NotFound from './shared/pages/NotFound';
import { Toaster } from "@/components/ui/sonner"
import useAuthStore from "./features/auth/store/auth";

export function App() {
    const { accessToken } = useAuthStore();
    return (
        <BrowserRouter>
            <Toaster />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/signup" element={accessToken ? <Navigate to="/" /> : <SignUp />} />
                <Route path="/login" element={accessToken ? <Navigate to="/" /> : <Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;