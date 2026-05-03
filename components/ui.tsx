import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "bg-white dark:bg-[#1c1917] rounded-2xl border border-[#ccfbf1] dark:border-[#1e293b] transition-all duration-200",
  {
    variants: {
      interactive: {
        true: "cursor-pointer active:scale-[0.98] hover:shadow-md hover:shadow-[#0891b2]/5",
        false: "",
      },
    },
    defaultVariants: {
      interactive: false,
    },
  }
);

export function Card({
  children,
  className,
  interactive = false,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      onClick={onClick}
      className={cn(cardVariants({ interactive, className }))}
      {...props}
    >
      {children}
    </div>
  );
}

const badgeVariants = cva(
  "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase",
  {
    variants: {
      variant: {
        default: "bg-[#f1f5f9] dark:bg-[#334155] text-[#475569] dark:text-[#cbd5e1]",
        success: "bg-[#d1fae5] dark:bg-[#064e3b] text-[#059669] dark:text-[#34d399]",
        warning: "bg-[#fef3c7] dark:bg-[#422006] text-[#d97706] dark:text-[#fbbf24]",
        danger: "bg-[#fee2e2] dark:bg-[#450a0a] text-[#dc2626] dark:text-[#f87171]",
        info: "bg-[#cffafe] dark:bg-[#083344] text-[#0891b2] dark:text-[#22d3ee]",
        primary: "bg-[#0891b2]/10 dark:bg-[#083344] text-[#0891b2] dark:text-[#22d3ee]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: VariantProps<typeof badgeVariants>["variant"];
  className?: string;
}) {
  return (
    <span className={cn(badgeVariants({ variant, className }))}>
      {children}
    </span>
  );
}

const buttonVariants = cva(
  "w-full px-6 py-3.5 rounded-xl font-bold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-[#0891b2] text-white hover:bg-[#0e7490] active:bg-[#0e7490] focus:ring-[#0891b2] disabled:bg-[#0891b2]/50",
        secondary: "bg-[#f1f5f9] dark:bg-[#334155] text-[#334155] dark:text-[#e2e8f0] hover:bg-[#e2e8f0] dark:hover:bg-[#475569] active:bg-[#e2e8f0] focus:ring-[#64748b]",
        cta: "bg-[#059669] text-white hover:bg-[#047857] active:bg-[#047857] focus:ring-[#059669] disabled:bg-[#059669]/50",
        danger: "bg-[#dc2626] text-white hover:bg-[#b91c1c] active:bg-[#b91c1c] focus:ring-[#dc2626] disabled:bg-[#dc2626]/50",
        ghost: "bg-transparent text-[#0891b2] hover:bg-[#0891b2]/5 active:bg-[#0891b2]/10 focus:ring-[#0891b2]",
      },
      size: {
        sm: "px-4 py-2.5 text-sm min-h-[40px]",
        md: "px-6 py-3.5 text-base min-h-[48px]",
        lg: "px-8 py-4 text-lg min-h-[56px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  id?: string;
}) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-bold text-[#334155] dark:text-[#cbd5e1]">
        {label}
        {required && <span className="text-[#dc2626] ml-1">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border-2 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1c1917] text-[#1e293b] dark:text-[#f8fafc] placeholder-[#94a3b8] focus:border-[#0891b2] dark:focus:border-[#22d3ee] transition-colors"
      />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  id?: string;
}) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-bold text-[#334155] dark:text-[#cbd5e1]">
        {label}
        {required && <span className="text-[#dc2626] ml-1">*</span>}
      </label>
      <textarea
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full rounded-xl border-2 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1c1917] text-[#1e293b] dark:text-[#f8fafc] placeholder-[#94a3b8] focus:border-[#0891b2] dark:focus:border-[#22d3ee] transition-colors resize-none"
      />
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  required = false,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  id?: string;
}) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-bold text-[#334155] dark:text-[#cbd5e1]">
        {label}
        {required && <span className="text-[#dc2626] ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full rounded-xl border-2 border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1c1917] text-[#1e293b] dark:text-[#f8fafc] focus:border-[#0891b2] dark:focus:border-[#22d3ee] transition-colors appearance-none px-4 pr-10"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b] pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16" role="status" aria-label="Loading">
      <div className="w-10 h-10 border-4 border-[#ccfbf1] dark:border-[#1e293b] border-t-[#0891b2] dark:border-t-[#22d3ee] rounded-full animate-spin" />
      <p className="mt-4 text-[#64748b] dark:text-[#94a3b8] text-sm font-medium">Loading...</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-[#f1f5f9] dark:bg-[#334155] rounded-2xl flex items-center justify-center mb-5">
        {icon || (
          <svg className="w-10 h-10 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-bold text-[#1e293b] dark:text-[#f8fafc]">{title}</h3>
      <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1.5 max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-5 w-full max-w-xs">{action}</div>}
    </div>
  );
}
