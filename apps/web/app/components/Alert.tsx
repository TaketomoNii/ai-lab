import React from 'react';

export default function Alert({
  kind = 'error',
  title,
  message,
}: {
  kind?: 'error' | 'info' | 'success';
  title: string;
  message?: string;
}) {
  const base = 'mb-4 rounded-lg border p-3 text-sm';
  const styles =
    kind === 'error'
      ? 'border-red-300 bg-red-50 text-red-800'
      : kind === 'success'
        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
        : 'border-blue-300 bg-blue-50 text-blue-800';
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={`${base} ${styles}`}>
      <p className="font-medium">{title}</p>
      {message && <p className="mt-1">{message}</p>}
    </div>
  );
}
