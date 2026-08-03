import { z } from "zod";

/**
 * Single source of truth for application validation.
 *
 * Imported by BOTH the client form and the API route, so the rules can never
 * drift apart. Client-side checks are a convenience; the server re-validates
 * because a request can always be crafted by hand.
 */
export const applicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "That name is too long — 80 characters max."),

  email: z
    .string()
    .trim()
    .min(1, "We need an email address to reply to you.")
    .email("That does not look like a valid email address."),

  phone: z
    .string()
    .trim()
    .min(7, "Please enter a reachable phone number, including country code.")
    .max(25, "That phone number is too long.")
    .regex(/^[+\d][\d\s()\-.]*$/, "Use digits, spaces, or + ( ) - only."),

  role: z.string().trim().min(1, "Please tell us what you do."),

  instagram: z
    .string()
    .trim()
    .max(120, "That handle is too long.")
    .optional()
    .or(z.literal("")),

  link: z
    .string()
    .trim()
    .max(300, "That link is too long.")
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .max(1500, "Please keep it under 1500 characters.")
    .optional()
    .or(z.literal("")),

  /**
   * Honeypot. Hidden from humans via CSS and aria-hidden; bots that fill
   * every field in the DOM will populate it.
   *
   * Deliberately permissive here: the API route inspects it and returns a
   * normal 200 without sending anything. Rejecting it at the schema level
   * would return a 400, which tells the bot exactly which field tripped it.
   */
  website: z.string().max(200).optional().or(z.literal("")),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

/** Field-name -> first error message, for rendering under each input. */
export type FieldErrors = Partial<Record<keyof ApplicationInput, string>>;

export function flattenErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};

  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ApplicationInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }

  return out;
}
