import { cn } from "@/lib/utils";

const tones = {
  primary: "bg-primary-fixed text-on-primary-fixed-variant",
  secondary: "bg-secondary-container/60 text-on-secondary-fixed-variant",
  tertiary: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  muted: "bg-surface-container-high text-on-surface-variant",
  danger: "bg-error-container text-on-error-container",
} as const;

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 font-mono text-label-sm",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
