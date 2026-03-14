import * as React from "react";
import { cn } from "./utils";

// Simple HTML select component for basic usage
export interface SimpleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const SimpleSelect = React.forwardRef<HTMLSelectElement, SimpleSelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "w-full border border-border rounded-lg px-3 py-2 text-sm",
          "bg-card text-foreground",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
SimpleSelect.displayName = "SimpleSelect";

// Context for complex select components
const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>({});

// Main Select component (wrapper)
export interface SelectComponentProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

function Select({ value, defaultValue, onValueChange, children }: SelectComponentProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || value || "");
  const [open, setOpen] = React.useState(false);

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
        open,
        onOpenChange: setOpen,
      }}
    >
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

// SelectTrigger component
export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(SelectContext);

    return (
      <button
        type="button"
        ref={ref}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "text-foreground",
          className
        )}
        onClick={() => onOpenChange?.(!open)}
        {...props}
      >
        {children}
        <svg
          className="h-4 w-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

// SelectValue component
export interface SelectValueProps {
  placeholder?: string;
}

function SelectValue({ placeholder }: SelectValueProps) {
  const { value } = React.useContext(SelectContext);

  return (
    <span className={cn(!value && "text-muted-foreground")}>
      {value || placeholder}
    </span>
  );
}

// SelectContent component
export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open } = React.useContext(SelectContext);

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border",
          "bg-card shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectContent.displayName = "SelectContent";

// SelectItem component
export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(SelectContext);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex cursor-pointer select-none items-center px-3 py-2 text-sm outline-none",
          "hover:bg-muted",
          "text-foreground",
          selectedValue === value && "bg-indigo-50 dark:bg-indigo-900/30 font-medium",
          className
        )}
        onClick={() => onValueChange?.(value)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SimpleSelect };