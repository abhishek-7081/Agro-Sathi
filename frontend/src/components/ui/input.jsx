export function Input({ className = '', ...props }) {
  return (
    <input
      className={`form-input-agri theme-input rounded-lg px-4 py-2.5 w-full ${className}`}
      {...props}
    />
  );
}
