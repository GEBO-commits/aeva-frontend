import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authService from '../services/authService';

/**
 * Global authentication state
 * user: Supabase Auth user object or null
 * isAuthenticated: true if logged in with email/password (not anonymous)
 * isAdmin: true if user has admin role (deferred to later phase)
 */
export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isAdmin: false,

            // Login: called after successful Supabase auth
            login: (userData) => set({
                user: userData,
                isAuthenticated: true,
                isAdmin: false, // Admin role determination deferred to Prompt M
            }),

            // Logout: call authService.signOut(), then clear state
            logout: async () => {
                const { error } = await authService.signOut();
                if (error) {
                    console.error('[auth.store] Logout failed:', error);
                }
                set({
                    user: null,
                    isAuthenticated: false,
                    isAdmin: false,
                });
                localStorage.removeItem('aeva-auth-store');
                localStorage.removeItem('aeva-plan-store');
            },

            // Restore session: check for valid non-anonymous Supabase session
            restoreSession: async () => {
                const { user, error } = await authService.getCurrentAuthUser();

                if (error) {
                    console.error('[auth.store] Failed to restore session:', error);
                    return;
                }

                // Only restore if user exists and is not anonymous
                // Anonymous users have user.id but user.aud = 'authenticated_anonymous'
                // Real auth users have user.aud = 'authenticated'
                if (user && user.aud === 'authenticated') {
                    set({
                        user,
                        isAuthenticated: true,
                        isAdmin: false,
                    });
                }
            },
        }),
        {
            name: 'aeva-auth-store',
        }
    )
);
