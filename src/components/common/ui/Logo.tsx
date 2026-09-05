import { cn } from "@/lib/utils/cn";

interface LogoProps {
  /** Rendered box in px. The mark occupies ~56% of its 512 viewBox, so it reads
   *  smaller than a solid square of the same size — 24 matches the old 20px block. */
  size?: number;
  className?: string;
}

/**
 * DevVault brand mark.
 *
 * Served as a file rather than inlined: the SVG carries its own `filter` and
 * `clipPath` ids, which would collide if the mark appeared twice on one page
 * (nav + footer). It also pins its own color, so there is nothing to theme.
 */
export default function Logo({ size = 24, className }: LogoProps) {
  return (
    // Static brand asset. The image optimizer cannot process SVG anyway, so a
    // plain <img> avoids a pointless request hop through /_next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/devvault-mark.svg"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={cn("shrink-0 select-none", className)}
    />
  );
}
