type LogoVariant = 'dark' | 'light';
type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  showWordmark?: boolean;
  className?: string;
}

const SIZE_PX: Record<LogoSize, number> = {
  sm: 28,
  md: 36,
  lg: 56,
};

const WORDMARK_CLASS: Record<LogoSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
};

export function Logo({
  variant = 'dark',
  size = 'md',
  showWordmark = false,
  className = '',
}: LogoProps): JSX.Element {
  const src = variant === 'dark' ? '/brand/logo-dark.png' : '/brand/logo-light.png';
  const px = SIZE_PX[size];
  const textColor = variant === 'dark' ? 'text-ink-900' : 'text-white';

  return (
    <a href="#top" className={`inline-flex items-center gap-2 ${className}`} aria-label="Good to Great">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Good to Great"
        width={px}
        height={px}
        className="select-none"
        draggable={false}
      />
      {showWordmark && (
        <span className={`font-extrabold tracking-tight ${WORDMARK_CLASS[size]} ${textColor}`}>
          GOOD TO GREAT
        </span>
      )}
    </a>
  );
}
