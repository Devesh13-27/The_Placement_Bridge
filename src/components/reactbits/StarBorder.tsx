import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

// Adapted from React Bits (https://reactbits.dev) — TS + Tailwind variant, MIT licensed.
// Pure CSS (no animation library) — keyframes registered in globals.css.
type StarBorderProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: ReactNode;
  color?: string;
  speed?: string;
  thickness?: number;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
};

export default function StarBorder<T extends ElementType = "button">({
  as,
  className = "",
  color = "#60a5fa",
  speed = "5s",
  thickness = 1,
  backgroundColor = "#2563eb",
  textColor = "#ffffff",
  borderColor = "#1d4ed8",
  children,
  ...rest
}: StarBorderProps<T>) {
  const Component = as || "button";

  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-xl ${className}`}
      {...rest}
      style={{ padding: `${thickness}px 0`, ...(rest as { style?: object }).style }}
    >
      <div
        className="absolute bottom-[-11px] right-[-250%] z-0 h-[50%] w-[300%] animate-star-movement-bottom rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="absolute left-[-250%] top-[-10px] z-0 h-[50%] w-[300%] animate-star-movement-top rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="relative z-10 rounded-xl border px-4 py-2.5 text-center text-sm font-medium"
        style={{ background: backgroundColor, color: textColor, borderColor }}
      >
        {children}
      </div>
    </Component>
  );
}
