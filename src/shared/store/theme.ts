import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'system' | 'dark' | 'light';

export interface ThemeState {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
}

export function applyTheme(mode: ThemeMode) {
    const root = document.documentElement;

    if (mode === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', isDark);
    } else if (mode === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

export function setupSystemListener(mode: ThemeMode) {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
}

const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            mode: 'system',
            setMode: (mode) => {
                applyTheme(mode);
                set({ mode });
            },
        }),
        {
            name: 'theme-storage',
        }
    )
);

export default useThemeStore;
