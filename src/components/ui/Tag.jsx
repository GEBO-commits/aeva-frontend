import React from 'react';

/**
 * Tag component for labels and badges.
 *
 * Props:
 * - tone: 'ember' | 'sage' | 'warning' | 'neutral' | 'danger' (default: 'neutral')
 * - size: 'sm' | 'md' (default: 'md')
 * - icon: Icon component or name (Lucide)
 * - children: ReactNode
 * - className: string
 */
export function Tag({
  tone = 'neutral',
  size = 'md',
  icon: IconComponent,
  children,
  className = '',
}) {
  const baseClass = 'tag';
  const toneClass = `tag-${tone}`;
  const sizeClass = size !== 'md' ? `tag-${size}` : '';

  return (
    <span className={`${baseClass} ${toneClass} ${sizeClass} ${className}`.trim()}>
      {IconComponent && <span className="icon">{IconComponent}</span>}
      {children}
    </span>
  );
}
