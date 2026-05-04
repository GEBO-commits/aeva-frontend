import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { Button } from '../components/ui/Button';
import * as authService from '../services/authService';

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

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!password || password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setIsLoading(true);

        try {
            const { user: currentUser } = await authService.getCurrentAuthUser();
            const anonymousUserId = currentUser?.id;

            const { user, error } = await authService.signInWithEmail(email, password);

            if (error) {
                console.error('[Login] Auth error:', error);
                setErrors({ general: error.message || 'Invalid email or password' });
                setIsLoading(false);
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
        } catch (err) {
            console.error('[Login] Unexpected error:', err);
            setErrors({ general: err.message || 'An unexpected error occurred' });
            setIsLoading(false);
        }
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

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--aeva-ink)', marginBottom: '4px', marginLeft: '4px' }} htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        {errors.email && <p style={{ color: 'var(--aeva-ink)', fontSize: '13px', marginTop: '4px', marginLeft: '4px' }}>{errors.email}</p>}
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--aeva-ink)', marginBottom: '4px', marginLeft: '4px' }} htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {errors.password && <p style={{ color: 'var(--aeva-ink)', fontSize: '13px', marginTop: '4px', marginLeft: '4px' }}>{errors.password}</p>}
                    </div>

                    {errors.general && (
                        <div style={{
                            background: 'var(--aeva-paper-warm)',
                            border: '1px solid var(--aeva-line)',
                            borderRadius: 'var(--r-lg)',
                            padding: '12px',
                            color: 'var(--aeva-ink)',
                            fontSize: '14px'
                        }}>
                            {errors.general}
                        </div>
                    )}

                    <Button variant="primary" size="lg" type="submit" disabled={isLoading} style={{ width: '100%' }}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center', color: 'var(--aeva-ink-soft)', fontSize: '14px' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--aeva-ink)', fontWeight: 700, textDecoration: 'none', transition: 'color 200ms' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aeva-ink-soft)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--aeva-ink)'}>Create one</Link>
                </div>
            </div>
        </motion.div>
    );
}
