import React from 'react';
import { TopNav } from '../navigation/TopNav';
import { Footer } from '../navigation/Footer';

/**
 * Shell — Main layout wrapper with TopNav, page content, and Footer.
 *
 * Props:
 * - children: ReactNode (page content)
 */
export function Shell({ children }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <TopNav />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
