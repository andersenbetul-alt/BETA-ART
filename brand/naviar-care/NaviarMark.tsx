/**
 * Drop-in replacement for the placeholder Lucide `heart-handshake` icon in the
 * NAVIAR CARE header.
 *
 * It paints with `currentColor`, so inside the existing header tile
 * (`bg-primary text-primary-foreground`) it picks up the right colour on its
 * own — no palette values are hardcoded, and it follows the site if the theme
 * tokens ever change.
 *
 *   import { NaviarMark } from "@/components/naviar-mark";
 *
 *   <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
 *     <NaviarMark className="size-6" />
 *   </span>
 *
 * `variant` selects between the four directions in the identity study.
 * "cradle" is the recommended one: two open arcs supporting a figure, which
 * says what the service does — the family is held up, not taken over.
 *
 * `accent` controls the one element that is not currentColor. Leave it unset
 * and the whole mark is monochrome, which is what the header tile wants. Pass
 * a token (e.g. "var(--secondary)") on light grounds where the mark is large
 * enough for two colours to read.
 */

export type NaviarMarkVariant = "cradle" | "wayfinder" | "monogram" | "hearth";

export interface NaviarMarkProps extends React.SVGProps<SVGSVGElement> {
  variant?: NaviarMarkVariant;
  accent?: string;
  title?: string;
}

export function NaviarMark({
  variant = "cradle",
  accent,
  title = "NAVIAR CARE",
  ...props
}: NaviarMarkProps) {
  const accentFill = accent ?? "currentColor";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label={title}
      {...props}
    >
      {variant === "cradle" && (
        <>
          <circle cx="32" cy="18" r="6.5" fill={accentFill} />
          <path
            d="M20 30 A12 12 0 0 0 44 30"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            opacity={accent ? 0.72 : 0.68}
          />
          <path
            d="M10 30 A22 22 0 0 0 54 30"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </>
      )}

      {variant === "wayfinder" && (
        <>
          <path
            d="M53.67 28.18 A22 22 0 1 0 39.52 52.67"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path d="M46.5 17.5 L35.3 35.3 L28.7 28.7 Z" fill={accentFill} />
          <path
            d="M17.5 46.5 L28.7 28.7 L35.3 35.3 Z"
            fill="currentColor"
            opacity={accent ? 0.72 : 0.68}
          />
        </>
      )}

      {variant === "monogram" && (
        <g strokeWidth="8" strokeLinecap="round">
          <path d="M15 50 V17" stroke="currentColor" />
          <path d="M49 50 V17" stroke="currentColor" />
          <path d="M15 17 L49 50" stroke={accent ?? "currentColor"} opacity={accent ? 1 : 0.68} />
        </g>
      )}

      {variant === "hearth" && (
        <>
          <path
            d="M16 30 V47 Q16 51 20 51 H44 Q48 51 48 47 V30"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M11 31 L32 13 L53 31"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M32 43.5 C24 38 23 36 23 33.5 A4.5 4.5 0 0 1 32 32.5 A4.5 4.5 0 0 1 41 33.5 C41 36 40 38 32 43.5 Z"
            fill={accentFill}
            opacity={accent ? 1 : 0.68}
          />
        </>
      )}
    </svg>
  );
}
