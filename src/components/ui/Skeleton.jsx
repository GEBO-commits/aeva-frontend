import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable Skeleton loader component
 */
export default function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-gray-200/80", className)}
            {...props}
        />
    );
}

// Pre-configured variations
export function CardSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full w-full gap-4">
            <Skeleton className="w-full h-48 rounded-2xl" />
            <Skeleton className="w-3/4 h-6 mt-2" />
            <div className="space-y-2 mt-2">
                <Skeleton className="w-1/2 h-4" />
                <Skeleton className="w-2/3 h-4" />
            </div>
            <div className="mt-auto pt-4 flex justify-between items-end border-t border-gray-100">
                <div className="space-y-2">
                    <Skeleton className="w-16 h-3" />
                    <Skeleton className="w-24 h-5" />
                </div>
                <Skeleton className="w-24 h-8 rounded-xl" />
            </div>
        </div>
    );
}

export function TextSkeleton({ lines = 3, className }) {
    return (
        <div className={cn("space-y-3 w-full", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")}
                />
            ))}
        </div>
    );
}
