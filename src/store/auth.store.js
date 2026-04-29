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
                user: {
                    ...userData,
                    display_name: userData.user_metadata?.full_name
                      || userData.email?.split('@')[0]
                      || 'User'
                },
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
                // Anonymous users have user.id but user.is_anonymous = true
                // Real auth users have user.is_anonymous !== true and user.email
                if (user && user.is_anonymous !== true && user.email) {
                    set({
                        user: {
                            ...user,
                            display_name: user.user_metadata?.full_name
                                || user.email?.split('@')[0]
                                || 'User'
                        },
                        isAuthenticated: true,
                        isAdmin: false,
                    });
                } else {
                    set({ user: null, isAuthenticated: false, isAdmin: false });
                }
            },
        }),
        {
            name: 'aeva-auth-store',
            partialize: (state) => ({})  // persist nothing — Supabase handles session
        }
    )
);
