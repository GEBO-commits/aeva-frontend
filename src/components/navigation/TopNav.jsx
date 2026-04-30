import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Sparkles, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export function TopNav() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, display_name } = useAuthStore();

  const navItems = [
    { id: 'venues', label: 'Venues', path: '/venues' },
    { id: 'catering', label: 'Catering', path: '/catering' },
    { id: 'decorations', label: 'Decorations', path: '/decorations' },
    { id: 'vendors', label: 'Vendors', path: '/vendors' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-nav)',
        background: 'rgba(250, 248, 245, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--aeva-line)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo & nav items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 400,
                color: 'var(--aeva-ink)',
                fontStyle: 'italic',
              }}
            >
              aeva
            </div>
          </Link>

          <div style={{ display: 'flex', gap: '4px' }}>
            {navItems.map(item => (
              <Link key={item.id} to={item.path}>
                <button
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '7px 14px',
                    borderRadius: 'var(--r-sm)',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    color: 'var(--aeva-ink-soft)',
                    letterSpacing: '-0.005em',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--aeva-paper-warm)';
                    e.currentTarget.style.color = 'var(--aeva-ink)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--aeva-ink-soft)';
                  }}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Right side — Auth buttons or user menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button
            variant="quiet"
            size="sm"
            onClick={() => navigate('/chat')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={14} /> Ask AEVA
          </Button>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>

              <button
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: '1px solid var(--aeva-line)',
                  background: 'var(--aeva-canvas)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--aeva-line-strong)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--aeva-line)';
                }}
              >
                <Bell size={15} color="var(--aeva-ink-mute)" />
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '7px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: 'var(--aeva-ember)',
                    border: '2px solid var(--aeva-canvas)',
                  }}
                />
              </button>

              <Avatar name={display_name} size="md" />

              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--aeva-ink-mute)',
                  transition: 'all 200ms ease',
                }}
                title="Logout"
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--aeva-ink)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--aeva-ink-mute)';
                }}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="quiet" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
