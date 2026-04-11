export function Card({ children, className = '' }) {
  return (
    <div
      className={`card-agri rounded-agri-lg overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`border-b theme-border theme-surface-soft px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h2
      className={`font-heading text-lg font-bold theme-heading ${className}`}
    >
      {children}
    </h2>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div
      className={`border-t theme-border px-6 py-4 flex justify-end gap-2 theme-surface-soft ${className}`}
    >
      {children}
    </div>
  );
}
