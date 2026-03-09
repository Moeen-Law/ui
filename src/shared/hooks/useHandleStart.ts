import useAuthStore from "@/features/auth/store/auth";
import { useNavigate } from "react-router-dom";


export const useHandleStart = () => {
    const { accessToken } = useAuthStore();
    const navigate = useNavigate();

    const handleStart = () => {
        if (accessToken) {
            navigate("/chat");
        } else {
            navigate("/login");
        }
    };

    return { handleStart };
}