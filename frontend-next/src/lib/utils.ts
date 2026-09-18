export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[];

/**
 * Combines class names into a single normalized class string,
 * filtering out falsy values.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    }
  }

  return classes.join(" ");
}
