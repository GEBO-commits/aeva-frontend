import React from 'react';

/**
 * Button component with variant and size modifiers.
 *
 * Props:
 * - variant: 'primary' | 'ember' | 'ghost' | 'quiet' (default: 'primary')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - disabled: boolean
 * - children: ReactNode
 * - className: string (additional classes)
 * - ...rest: passed to <button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  className = '',
  ...rest
}) {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`.trim()}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
