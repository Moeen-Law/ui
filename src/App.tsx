import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './features/landing/pages/Landing';
import Chat from './features/chat/pages/Chat';

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;