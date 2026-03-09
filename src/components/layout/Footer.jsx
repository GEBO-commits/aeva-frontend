import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Simple minimal footer
 */
export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-2">
                    <span className="text-2xl font-display font-bold text-primary mb-4 block">AEVA</span>
                    <p className="text-text-muted mb-4 max-w-sm">
                        AI-powered event planning and management for unforgettable weddings, corporate features, and birthdays.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold text-text-dark mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                        <li><Link to="/recommendations" className="text-text-muted hover:text-primary transition-colors">Find a Venue</Link></li>
                        <li><Link to="/survey" className="text-text-muted hover:text-primary transition-colors">Start Planning</Link></li>
                        <li><Link to="/login" className="text-text-muted hover:text-primary transition-colors">Sign In</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-text-dark mb-4">Legal</h4>
                    <ul className="space-y-2">
                        <li><Link to="/privacy-policy" className="text-text-muted hover:text-primary transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms-of-service" className="text-text-muted hover:text-primary transition-colors">Terms of Service</Link></li>
                        <li><Link to="/contact" className="text-text-muted hover:text-primary transition-colors">Contact Us</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-100 text-center text-sm text-text-muted">
                © {new Date().getFullYear()} AEVA. All rights reserved.
            </div>
        </footer>
    );
}
