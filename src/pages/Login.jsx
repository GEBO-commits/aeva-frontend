import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { Button } from '../components/ui/Button';
import * as authService from '../services/authService';

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
        setAuthError(null);

        const { user: currentUser } = await authService.getCurrentAuthUser();
        const anonymousUserId = currentUser?.id;

        const { user, error } = await authService.signInWithEmail(data.email, data.password);

        if (error) {
            console.error('[Login] Auth error:', error);
            setAuthError(error.message || 'Invalid email or password');
            return;
        }

        if (anonymousUserId && user.id !== anonymousUserId) {
            try {
                await authService.claimAnonymousSession(anonymousUserId, user.id);
            } catch (mergeError) {
                console.warn('[Login] Session merge failed, proceeding anyway:', mergeError);
            }
        }

        login(user);
        navigate(from, { replace: true });
    };

    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '70vh'
        }}>
            <div style={{
                background: 'var(--aeva-canvas)',
                padding: '32px',
                borderRadius: 'var(--r-2xl)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--aeva-line)',
                width: '100%',
                maxWidth: '28rem'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '8px' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--aeva-ink-soft)' }}>Sign in to continue planning your event</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--aeva-ink)', marginBottom: '4px', marginLeft: '4px' }} htmlFor="email">Email Address</label>
                        <input
                            {...register('email')}
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            onChange={(e) => { setAuthError(null); }}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 'var(--r-lg)',
                                border: '1px solid var(--aeva-line)',
                                background: 'var(--aeva-paper-warm)',
                                color: 'var(--aeva-ink)',
                                fontSize: '14px',
                                transition: 'all 200ms',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'var(--aeva-ink)';
                                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'var(--aeva-line)';
                                e.currentTarget.style.boxShadow = '';
                            }}
                        />
                        {errors.email && <p style={{ color: 'var(--aeva-ink)', fontSize: '13px', marginTop: '4px', marginLeft: '4px' }}>{errors.email.message}</p>}
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--aeva-ink)', marginBottom: '4px', marginLeft: '4px' }} htmlFor="password">Password</label>
                        <input
                            {...register('password')}
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={(e) => { setAuthError(null); }}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 'var(--r-lg)',
                                border: '1px solid var(--aeva-line)',
                                background: 'var(--aeva-paper-warm)',
                                color: 'var(--aeva-ink)',
                                fontSize: '14px',
                                transition: 'all 200ms',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'var(--aeva-ink)';
                                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'var(--aeva-line)';
                                e.currentTarget.style.boxShadow = '';
                            }}
                        />
                        {errors.password && <p style={{ color: 'var(--aeva-ink)', fontSize: '13px', marginTop: '4px', marginLeft: '4px' }}>{errors.password.message}</p>}
                    </div>

                    {authError && (
                        <div style={{
                            background: 'var(--aeva-paper-warm)',
                            border: '1px solid var(--aeva-line)',
                            borderRadius: 'var(--r-lg)',
                            padding: '12px',
                            color: 'var(--aeva-ink)',
                            fontSize: '14px'
                        }}>
                            {authError}
                        </div>
                    )}

                    <Button variant="primary" size="lg" type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center', color: 'var(--aeva-ink-soft)', fontSize: '14px' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--aeva-ink)', fontWeight: 700, textDecoration: 'none', transition: 'color 200ms' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aeva-ink-soft)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--aeva-ink)'}>Create one</Link>
                </div>
            </div>
        </motion.div>
    );
}
