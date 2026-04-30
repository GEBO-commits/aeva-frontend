import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { CheckCircle, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import * as authService from '../services/authService';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95 }
};

export default function Register() {
    const [authError, setAuthError] = useState(null);
    const [registered, setRegistered] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        setAuthError(null);

        const { user, error } = await authService.signUpWithEmail(data.email, data.password, data.name);

        if (error) {
            console.error('[Register] Auth error:', error);
            setAuthError(error.message || 'Failed to create account');
            return;
        }

        setRegisteredEmail(data.email);
        setRegistered(true);
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
                {registered ? (
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '16px'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'var(--aeva-sage)',
                                opacity: 0.15,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <CheckCircle className="w-8 h-8" style={{ color: 'var(--aeva-sage)' }} />
                            </div>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '8px' }}>Check Your Email</h2>
                            <p style={{ color: 'var(--aeva-ink-soft)' }}>We sent a confirmation email to <span style={{ fontWeight: 600, color: 'var(--aeva-ink)' }}>{registeredEmail}</span></p>
                        </div>
                        <div style={{
                            background: 'var(--aeva-paper-warm)',
                            border: '1px solid var(--aeva-line)',
                            borderRadius: 'var(--r-lg)',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <Mail className="w-5 h-5" style={{ color: 'var(--aeva-ink)', marginTop: '2px', flexShrink: 0 }} />
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--aeva-ink)', marginBottom: '4px' }}>Please click the link in the email</p>
                                    <p style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)' }}>to activate your account before logging in.</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--aeva-line)' }}>
                            <p style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)', marginBottom: '16px' }}>Didn't receive the email? Check your spam folder or try again.</p>
                            <Button variant="primary" size="lg" onClick={() => setRegistered(false)} style={{ width: '100%' }}>
                                Back to Register
                            </Button>
                        </div>
                        <div style={{ textAlign: 'center', color: 'var(--aeva-ink-soft)', fontSize: '14px' }}>
                            Already confirmed? <Link to="/login" style={{ color: 'var(--aeva-ink)', fontWeight: 700, textDecoration: 'none', transition: 'color 200ms' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aeva-ink-soft)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--aeva-ink)'}>Sign in</Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '8px' }}>Create Account</h2>
                            <p style={{ color: 'var(--aeva-ink-soft)' }}>Join AEVA and start planning your perfect event today.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--aeva-ink)', marginBottom: '4px', marginLeft: '4px' }} htmlFor="name">Full Name</label>
                                <input
                                    {...register('name')}
                                    id="name"
                                    type="text"
                                    placeholder="Emma Johnson"
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
                                {errors.name && <p style={{ color: 'var(--aeva-ink)', fontSize: '13px', marginTop: '4px', marginLeft: '4px' }}>{errors.name.message}</p>}
                            </div>

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
                                {isSubmitting ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </form>

                        <div style={{ textAlign: 'center', color: 'var(--aeva-ink-soft)', fontSize: '14px' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--aeva-ink)', fontWeight: 700, textDecoration: 'none', transition: 'color 200ms' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--aeva-ink-soft)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--aeva-ink)'}>Sign in</Link>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}
