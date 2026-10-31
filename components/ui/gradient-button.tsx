'use client';

import type { HTMLAttributes } from 'react';

interface GradientButtonProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  width?: string;
  height?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const GradientButton = ({
  children,
  width,
  height = '36px',
  className = '',
  onClick,
  disabled = false,
  ...props
}: GradientButtonProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      className={`
        relative rounded-full cursor-pointer
        rotatingGradient
        flex items-center justify-center
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        '--r': '0deg',
        minWidth: width,
        height: height,
      } as React.CSSProperties}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      aria-disabled={disabled}
      {...props}
    >
      {/* Inner dark background layer */}
      <span className="absolute inset-[2px] rounded-full bg-[#0d0f14] z-[1]" />
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center px-4 text-xs font-medium text-white/80 hover:text-white transition-colors duration-200 whitespace-nowrap">
        {children}
      </span>
    </div>
  );
};

export default GradientButton;
