import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import * as authService from '../services/authService';
import { supabase } from '../lib/supabaseClient';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10 }
};

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/dashboard';
    const login = useAuthStore(state => state.login);
    const [authError, setAuthError] = useState(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onSubmit'
    });

    const onSubmit = async (data) => {
        if (isSubmitting) return;
        setAuthError(null);

        // Ensure anonymous session is ready before login
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Capture current user before login (may be anonymous)
        const { user: currentUser } = await authService.getCurrentAuthUser();
        const anonymousUserId = currentUser?.id;

        const { user, error } = await authService.signInWithEmail(data.email, data.password);

        if (error) {
            console.error('[Login] Auth error:', error);
            setAuthError(error.message || 'Invalid email or password');
            return;
        }

        // Claim anonymous session if it exists and is different from authenticated user.
        // Non-fatal: edge function may not be deployed in all environments — log and continue.
        if (anonymousUserId && user.id !== anonymousUserId) {
            try {
                await authService.claimAnonymousSession(anonymousUserId, user.id);
            } catch (mergeError) {
                console.warn('[Login] Session merge skipped (edge function unavailable):', mergeError);
            }
        }

        login(user);
        navigate(from, { replace: true });
    };

    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex justify-center items-center min-h-[70vh]">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold text-primary mb-2">Welcome Back</h2>
                    <p className="text-text-muted">Sign in to continue planning your event</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1 ml-1" htmlFor="email">Email Address</label>
                        <input
                            {...register('email')}
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            onChange={(e) => { setAuthError(null); }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                        />
                        {errors.email && <p className="text-accent text-sm mt-1 ml-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1 ml-1" htmlFor="password">Password</label>
                        <input
                            {...register('password')}
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={(e) => { setAuthError(null); }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                        />
                        {errors.password && <p className="text-accent text-sm mt-1 ml-1">{errors.password.message}</p>}
                    </div>

                    {authError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                            {authError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-secondary transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-text-muted">
                    Don't have an account? <Link to="/register" className="text-primary font-bold hover:text-secondary transition-colors">Create one</Link>
                </div>
            </div>
        </motion.div>
    );
}
