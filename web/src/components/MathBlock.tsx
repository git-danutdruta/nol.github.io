import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathBlockProps {
  latex: string;
  display?: boolean;
  ariaLabel?: string;
}

export function MathBlock({ latex, display = false, ariaLabel }: MathBlockProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    katex.render(latex, ref.current, {
      throwOnError: false,
      displayMode: display,
      output: 'htmlAndMathml',
    });
  }, [latex, display]);

  return (
    <span
      ref={ref}
      role="math"
      aria-label={ariaLabel || latex}
      className={display ? 'my-4 block overflow-x-auto' : 'inline'}
    />
  );
}
