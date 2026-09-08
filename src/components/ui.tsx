"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "dark";
}) {
  const styles = {
    primary:
      "bg-champagne text-ink hover:bg-[#d0ae78] shadow-glow disabled:opacity-50",
    secondary:
      "bg-white text-ink border border-sand hover:bg-mist disabled:opacity-50",
    ghost: "bg-transparent text-ink hover:bg-sand/60",
    dark: "bg-ink text-ivory hover:bg-[#2a241c]",
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition ${styles} ${className}`}
      {...props}
    />
  );
}

export function Field({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs uppercase tracking-[0.16em] text-ink/60">{label}</span>
      <input
        className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm outline-none ring-champagne/30 focus:ring-2"
        {...props}
      />
    </label>
  );
}

export function TextArea({
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs uppercase tracking-[0.16em] text-ink/60">{label}</span>
      <textarea
        className="min-h-28 w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm outline-none ring-champagne/30 focus:ring-2"
        {...props}
      />
    </label>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-sand bg-white p-6 shadow-card ${className}`}>
      {children}
    </div>
  );
}
