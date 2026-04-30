import React from 'react';

/**
 * Avatar component showing initials from a name.
 *
 * Props:
 * - name: string (used to extract initials)
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - className: string
 */
export function Avatar({ name = 'User', size = 'md', className = '' }) {
  const initials = name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  const baseClass = 'avatar';
  const sizeClass = `avatar-${size}`;

  return (
    <div
      className={`${baseClass} ${sizeClass} ${className}`.trim()}
      title={name}
    >
      {initials}
    </div>
  );
}
