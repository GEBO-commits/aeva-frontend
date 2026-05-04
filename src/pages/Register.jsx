import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import * as authService from '../services/authService';

const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95 }
};

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState(null);

    const validate = () => {
        const newErrors = {};
        if (!name || name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
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
            const { user, error } = await authService.signUpWithEmail(email, password, name);

            if (error) {
                console.error('[Register] Auth error:', error);
                setErrors({ general: error.message || 'Failed to create account' });
                setIsLoading(false);
                return;
            }

            setRegisteredEmail(email);
            setRegistered(true);
        } catch (err) {
            console.error('[Register] Unexpected error:', err);
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

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--aeva-ink)', marginBottom: '4px', marginLeft: '4px' }} htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Emma Johnson"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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
                                {errors.name && <p style={{ color: 'var(--aeva-ink)', fontSize: '13px', marginTop: '4px', marginLeft: '4px' }}>{errors.name}</p>}
                            </div>

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
                                {isLoading ? 'Creating account...' : 'Create Account'}
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
