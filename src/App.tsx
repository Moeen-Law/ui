import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './features/landing/pages/Landing';
import Chat from './features/chat/pages/Chat';
import SignUp from './features/auth/pages/SignUp';
import Login from './features/auth/pages/Login';

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;