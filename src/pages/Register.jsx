import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

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
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/dashboard';
    const login = useAuthStore(state => state.login);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        await new Promise(r => setTimeout(r, 800));

        // Auto-login after register
        login({
            id: 'u002',
            name: data.name,
            email: data.email,
            role: 'user'
        });

        navigate(from, { replace: true });
    };

    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex justify-center items-center min-h-[70vh]">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold text-primary mb-2">Create Account</h2>
                    <p className="text-text-muted">Join AEVA and start planning your perfect event today.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1 ml-1" htmlFor="name">Full Name</label>
                        <input
                            {...register('name')}
                            id="name"
                            type="text"
                            placeholder="Emma Johnson"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                        />
                        {errors.name && <p className="text-accent text-sm mt-1 ml-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1 ml-1" htmlFor="email">Email Address</label>
                        <input
                            {...register('email')}
                            id="email"
                            type="email"
                            placeholder="you@example.com"
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
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                        />
                        {errors.password && <p className="text-accent text-sm mt-1 ml-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-secondary transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center text-text-muted">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:text-secondary transition-colors">Sign in</Link>
                </div>
            </div>
        </motion.div>
    );
}
