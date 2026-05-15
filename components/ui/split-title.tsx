import React from 'react';

interface SplitTitleProps {
  text: string;
  className?: string;
}

/**
 * SplitTitle component splits a string into two parts:
 * - The first word: Styled in solid white.
 * - The rest: Styled with an orange/amber gradient.
 */
export function SplitTitle({ text, className = "" }: SplitTitleProps) {
  if (!text) return null;
  
  const words = text.trim().split(/\s+/);
  
  if (words.length <= 1) {
    return <span className={className}>{text}</span>;
  }

  const firstWord = words[0];
  const restOfText = words.slice(1).join(' ');

  return (
    <span className={className}>
      <span className="text-white">{firstWord}</span>{' '}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
        {restOfText}
      </span>
    </span>
  );
}
