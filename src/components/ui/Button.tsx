import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import type { ComponentProps } from "react";

type Variant = "teal" | "navy" | "primary" | "white" | "outline" | "outlineWhite";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded font-label text-label-caps uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  teal: "bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim",
  navy: "bg-on-primary-fixed text-on-primary hover:bg-on-primary-fixed-variant",
  primary: "bg-primary-container text-on-primary hover:bg-primary",
  white: "bg-white text-primary-container hover:bg-surface-container-low",
  outline:
    "border border-outline bg-white text-on-surface hover:bg-surface-container-low",
  outlineWhite: "border border-white text-white hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-2",
  lg: "px-8 py-3",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, keyof CommonProps> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonProps | "href"> & {
    href: string;
  };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
      props;
    return (
      <Link className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } =
    props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
