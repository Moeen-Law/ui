import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatUIState } from '../types';



export const useChatUIStore = create<ChatUIState>()(
    persist(
        (set) => ({
            isSidebarOpen: true,
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
            setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
        }),
        {
            name: 'chat-ui-storage',
        }
    )
);
