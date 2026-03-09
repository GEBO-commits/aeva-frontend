import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Global authentication state
 */
export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,          // null means not logged in
            isAuthenticated: false,
            isAdmin: false,

            // Actions
            login: (userData) => set({
                user: userData,
                isAuthenticated: true,
                isAdmin: userData?.role === 'admin'
            }),
            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    isAdmin: false
                });
                // Note: intentional logout may clear other stores if necessary.
                // localStorage.clear() can be too aggressive if we want to keep some preferences,
                // but if we want to clear everything on logout:
                localStorage.removeItem('aeva-auth-store');
                localStorage.removeItem('aeva-plan-store');
            },
        }),
        {
            name: 'aeva-auth-store', // namespace in localStorage
        }
    )
);
