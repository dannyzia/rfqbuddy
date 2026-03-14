import * as React from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export function Progress({ value = 0, className = "", ...props }: ProgressProps) {
  return (
    <div
      className={`relative h-4 w-full overflow-hidden rounded-full bg-muted ${className}`}
      {...props}
    >
      <div
        className="h-full bg-blue-600 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}