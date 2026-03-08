import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthStore } from '../types'; 




const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            accessToken: null,
            setAccessToken: (newToken) => set({ accessToken: newToken }),
            removeAccessToken: () => set({ accessToken: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
)

export default useAuthStore