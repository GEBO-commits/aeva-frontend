import React from 'react';

export default function Skeleton({ style, ...props }) {
    return (
        <div
            style={{
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                borderRadius: 'var(--r-md)',
                background: 'var(--aeva-paper)',
                ...style
            }}
            {...props}
        />
    );
}

export function CardSkeleton() {
    return (
        <div style={{
            background: 'var(--aeva-canvas)',
            borderRadius: 'var(--r-3xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--aeva-line)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            gap: '16px'
        }}>
            <Skeleton style={{ width: '100%', height: '192px', borderRadius: 'var(--r-2xl)' }} />
            <Skeleton style={{ width: '75%', height: '24px', marginTop: '8px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                <Skeleton style={{ width: '50%', height: '16px' }} />
                <Skeleton style={{ width: '66%', height: '16px' }} />
            </div>
            <div style={{
                marginTop: 'auto',
                paddingTop: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                borderTop: '1px solid var(--aeva-line)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Skeleton style={{ width: '64px', height: '12px' }} />
                    <Skeleton style={{ width: '96px', height: '20px' }} />
                </div>
                <Skeleton style={{ width: '96px', height: '32px', borderRadius: 'var(--r-xl)' }} />
            </div>
        </div>
    );
}

export function TextSkeleton({ lines = 3, style }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            ...style
        }}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    style={{
                        height: '16px',
                        width: i === lines - 1 ? '66%' : '100%'
                    }}
                />
            ))}
        </div>
    );
}
