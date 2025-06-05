import React from "react";

const Loading = ( {variant = 'spinner',  size = 'md', color = 'blue' } ) => {
    
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    const colorClasses = {
        blue: 'border-blue-500',
        purple: 'border-purple-500',
        green: 'border-green-500',
        red: 'border-red-500',
        gray: 'border-gray-500'
    };

    const dotColorClasses = {
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        green: 'bg-green-500',
        red: 'bg-red-500',
        gray: 'bg-gray-500'
    };

    if (variant === 'spinner') {
        return (
            <div className={`${sizeClasses[size]} ${colorClasses[color]} border-4 border-t-transparent rounded-full animate-spin`} />
        );
    }

    if (variant === 'dots') {
        return (
            <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} ${dotColorClasses[color]} rounded-full animate-pulse`}
                        style={{
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '1s'
                        }}
                    />
                ))}
            </div>
        );
    }

    if (variant === 'pulse') {
        return (
            <div className={`${sizeClasses[size]} ${dotColorClasses[color]} rounded-full animate-pulse`} />
        );
    }

    if (variant === 'bars') {
        return (
            <div className="flex items-end space-x-1">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`${size === 'sm' ? 'w-1' : size === 'md' ? 'w-2' : 'w-3'} ${dotColorClasses[color]} rounded-t animate-pulse`}
                        style={{
                        height: `${12 + (i % 2) * 8}px`,
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: '0.8s'
                        }}
                    />
                ))}
            </div>
        );
    }

    if (variant === 'wave') {
        return (
            <div className="flex items-center space-x-1">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`${size === 'sm' ? 'w-1 h-3' : size === 'md' ? 'w-2 h-4' : 'w-3 h-6'} ${dotColorClasses[color]} rounded-full animate-bounce`}
                        style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '1.2s'
                        }}
                    />
                ))}
            </div>
        );
    }

    return null;
};

export default Loading;