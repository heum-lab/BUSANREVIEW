import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

type ButtonAsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsAnchor = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed',
  secondary:
    'bg-ink-900 text-white hover:bg-ink-800 disabled:opacity-60 disabled:cursor-not-allowed',
  ghost:
    'bg-white text-ink-900 ring-1 ring-ink-100 hover:bg-ink-100/50 disabled:opacity-60 disabled:cursor-not-allowed',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-14 px-7 text-base',
};

export function Button(props: ButtonProps): JSX.Element {
  const { variant = 'primary', size = 'md', children, className = '', ...rest } = props as BaseProps & {
    className?: string;
    href?: string;
  };

  const classes = `inline-flex items-center justify-center rounded-xl font-semibold transition-colors ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`;

  if ('href' in props && props.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
