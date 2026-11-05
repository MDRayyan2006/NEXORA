import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Button ────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants: Record<string, string> = {
      primary: "bg-navy-700 text-white hover:bg-navy-800 focus:ring-navy-500",
      secondary: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-400",
      ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-400",
      outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400",
      danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
    };
    const sizes: Record<string, string> = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2.5",
      lg: "text-base px-6 py-3",
    };
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// ─── Card ──────────────────────────────────────────────────────────────────
export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-white rounded-2xl border border-slate-100 shadow-sm", className)}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pb-0", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-lg font-semibold text-slate-900", className)} {...props} />
);

export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-slate-500 mt-1", className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6", className)} {...props} />
);

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0 flex items-center", className)} {...props} />
);

// ─── Badge ─────────────────────────────────────────────────────────────────
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
}

export const Badge = ({ className, variant = "default", ...props }: BadgeProps) => {
  const variants: Record<string, string> = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-teal-100 text-teal-700",
    outline: "border border-slate-300 text-slate-700 bg-transparent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

// ─── Progress ──────────────────────────────────────────────────────────────
interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  label?: string;
}

export const Progress = ({ value, max = 100, className, color, label }: ProgressProps) => {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className={cn("space-y-1", className)}>
      {label && <span className="text-xs text-slate-500">{label}</span>}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: color ?? "#0d9488",
          }}
        />
      </div>
    </div>
  );
};

// ─── Input ─────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700 block">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 text-sm bg-white border rounded-xl transition-colors",
            "placeholder:text-slate-400 text-slate-900",
            "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
            error ? "border-red-400" : "border-slate-200 hover:border-slate-300",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// ─── Textarea ──────────────────────────────────────────────────────────────
export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }
>(({ className, label, error, ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-700 block">{label}</label>}
    <textarea
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 text-sm bg-white border rounded-xl transition-colors resize-none",
        "placeholder:text-slate-400 text-slate-900",
        "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
        error ? "border-red-400" : "border-slate-200 hover:border-slate-300",
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));
Textarea.displayName = "Textarea";

// ─── Select ────────────────────────────────────────────────────────────────
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }
>(({ className, label, children, ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-700 block">{label}</label>}
    <select
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl",
        "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
        "hover:border-slate-300 transition-colors text-slate-900",
        className
      )}
      {...props}
    >
      {children}
    </select>
  </div>
));
Select.displayName = "Select";

// ─── Avatar ────────────────────────────────────────────────────────────────
interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const avatarSizes = { sm: "h-7 w-7 text-xs", md: "h-9 w-9 text-sm", lg: "h-12 w-12 text-base", xl: "h-16 w-16 text-xl" };

export const Avatar = ({ src, name, size = "md", className }: AvatarProps) => {
  const initials = name
    .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", avatarSizes[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-teal-400 to-navy-600 flex items-center justify-center font-semibold text-white",
        avatarSizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
};

// ─── Spinner ───────────────────────────────────────────────────────────────
export const Spinner = ({ size = 20 }: { size?: number }) => (
  <svg
    className="animate-spin text-teal-500"
    style={{ width: size, height: size }}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ─── Empty State ───────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
    {icon && <div className="text-5xl">{icon}</div>}
    <div>
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {description && <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">{description}</p>}
    </div>
    {action}
  </div>
);

// ─── Alert ─────────────────────────────────────────────────────────────────
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
}

export const Alert = ({ variant = "info", title, children, className, ...props }: AlertProps) => {
  const variants: Record<string, string> = {
    info: "bg-teal-50 border-teal-200 text-teal-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    danger: "bg-red-50 border-red-200 text-red-800",
  };
  const icons: Record<string, string> = {
    info: "ℹ️", success: "✅", warning: "⚠️", danger: "❌",
  };
  return (
    <div className={cn("border rounded-xl p-4 text-sm", variants[variant], className)} {...props}>
      <div className="flex gap-2">
        <span className="mt-0.5">{icons[variant]}</span>
        <div>
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

// ─── Tooltip ───────────────────────────────────────────────────────────────
export const Tooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) => (
  <div className="relative group inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
      {content}
    </div>
  </div>
);

// ─── DemoBanner ────────────────────────────────────────────────────────────
export const DemoBanner = () => (
  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-2 rounded-xl flex items-center gap-2">
    <span>⚠️</span>
    <span>
      <strong>Demo Mode</strong> — AI responses are pre-generated samples. Set{" "}
      <code className="font-mono bg-amber-100 px-1 rounded">GEMMA_PROVIDER=groq</code> in{" "}
      <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code> for live AI.
    </span>
  </div>
);

