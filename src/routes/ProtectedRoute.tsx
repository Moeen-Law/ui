import useAuthStore from "@/features/auth/store/auth"
import { Navigate } from "react-router-dom"


interface ProtectedRouteProps {
    children: React.ReactNode
}

function ProtectedRoute({children}: ProtectedRouteProps) {
    const { accessToken } = useAuthStore()
  
     if (!accessToken) {
        return <Navigate to="/" />
     }

     return children
}

export default ProtectedRoute