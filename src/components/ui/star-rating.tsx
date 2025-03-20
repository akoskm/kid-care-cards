import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value?: number;
  onChange: (value: number) => void;
  className?: string;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, className, readOnly = false }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => !readOnly && onChange(rating)}
          className={cn(
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1',
            readOnly && 'cursor-default'
          )}
          disabled={readOnly}
        >
          <Star
            className={cn(
              'w-6 h-6 transition-colors',
              rating <= (value || 0)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        </button>
      ))}
    </div>
  );
}