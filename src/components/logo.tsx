import Link from "next/link";

export function Logo({ href = "/", light = false }: { href?: string; light?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <span
        className={`grid h-8 w-8 place-items-center rounded-full ${
          light ? "bg-ivory text-ink" : "bg-ink text-ivory"
        }`}
      >
        G
      </span>
      <span className={`font-display text-xl tracking-tight ${light ? "text-ivory" : "text-ink"}`}>
        Glowline
      </span>
    </Link>
  );
}
