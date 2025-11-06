import React from 'react';

type CardProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function Card({ title, subtitle, children, className }: CardProps) {
  return (
    <div
      className={['rounded-2xl border border-slate-200 bg-white p-6 shadow-sm', className]
        .filter(Boolean)
        .join(' ')}
    >
      {subtitle && <p className="text-sm uppercase tracking-wide text-slate-500">{subtitle}</p>}
      {title && <p className="text-2xl font-semibold text-slate-900">{title}</p>}
      {children}
    </div>
  );
}
