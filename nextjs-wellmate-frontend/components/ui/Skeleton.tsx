"use client";

import React from "react";

interface SkeletonProps {
    className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`animate-shimmer rounded-md bg-gray-100 ${className}`}
        />
    );
}
