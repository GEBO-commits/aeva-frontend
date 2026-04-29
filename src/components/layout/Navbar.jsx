import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { LogOut, User } from 'lucide-react';

/**
 * Main navigation bar
 */
export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white shadow-md border-b border-gray-100 py-3'
            : 'bg-gray-100/95 backdrop-blur-sm shadow-sm py-4'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center transition-all">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-display font-bold text-primary">
                            AEVA
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex gap-8 items-center">
                        <Link to="/recommendations" className="text-gray-500 font-bold hover:text-gray-900 transition-colors">Venues</Link>
                        <Link to="/catering" className="text-gray-500 font-bold hover:text-gray-900 transition-colors">Catering</Link>
                        <Link to="/decorations" className="text-gray-500 font-bold hover:text-gray-900 transition-colors">Decorations</Link>
                        <Link to="/vendors" className="text-gray-500 font-bold hover:text-gray-900 transition-colors">Vendors</Link>

                        <div className="h-6 w-px bg-gray-200 mx-2"></div>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard" className="text-primary font-bold hover:text-secondary transition-colors">Dashboard</Link>
                                <div className="flex items-center gap-4 ml-2 border-l pl-4 border-gray-200">
                                    <span className="text-sm font-bold text-text-dark">Hello, {user?.display_name || 'User'}</span>
                                    <button onClick={handleLogout} className="text-gray-400 hover:text-accent p-2 rounded-full hover:bg-gray-50 transition-colors" aria-label="Logout">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link to="/login" className="text-gray-500 font-bold hover:text-primary transition-colors">Log In</Link>
                                <Link to="/survey" className="bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-secondary hover:shadow-lg transition-all transform hover:-translate-y-0.5 shadow-sm">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
