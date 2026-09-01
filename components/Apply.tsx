"use client";

import { useRef, useState } from "react";
import { Check, Loader2, AlertCircle, ArrowUpRight } from "lucide-react";
import { apply, applyRoles, site } from "@/lib/content";
import { applicationSchema, flattenErrors, type FieldErrors } from "@/lib/schema";
import Reveal from "./Reveal";
import ApplyRoleFields, {
  buildRoleAnswers,
  validateRoleFields,
  type RoleAnswers,
  type RoleFieldErrors,
} from "./ApplyRoleFields";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  role: "",
  instagram: "",
  message: "",
  website: "", // honeypot
};

export default function Apply() {
  const [values, setValues] = useState(EMPTY);
  const [roleAnswers, setRoleAnswers] = useState<RoleAnswers>({});
  const [roleFieldErrors, setRoleFieldErrors] = useState<RoleFieldErrors>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const setRoleAnswer = (key: string, value: string) => {
    setRoleAnswers((a) => ({ ...a, [key]: value }));
    if (roleFieldErrors[key]) setRoleFieldErrors((e) => ({ ...e, [key]: "" }));
  };

  const onRoleChange = (roleId: string) => {
    set("role")(roleId);
    // Different roles have different fields — stale answers from a
    // previously-selected role should never leak into a new one.
    setRoleAnswers({});
    setRoleFieldErrors({});
  };

  const set = (key: keyof typeof EMPTY) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    // Clear the error as soon as the user starts fixing the field —
    // punishing them mid-keystroke is the fastest way to lose a submission.
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  /** Validate one field on blur (not on every keystroke). */
  const validateField = (key: keyof typeof EMPTY) => () => {
    const result = applicationSchema.safeParse(values);
    if (result.success) {
      setErrors((e) => ({ ...e, [key]: undefined }));
      return;
    }
    const all = flattenErrors(result.error);
    setErrors((e) => ({ ...e, [key]: all[key] }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const roleErrors = validateRoleFields(values.role, roleAnswers);
    const answers = buildRoleAnswers(values.role, roleAnswers);
    const result = applicationSchema.safeParse({ ...values, answers });

    if (!result.success || Object.keys(roleErrors).length > 0) {
      const fieldErrors = result.success ? {} : flattenErrors(result.error);
      setErrors(fieldErrors);
      setRoleFieldErrors(roleErrors);
      setStatus("idle");

      // Move focus to the first invalid field (WCAG: focus-management) —
      // core fields have a matching `[name]`, role fields have a matching
      // `#rolefield-<key>` wrapper (they're custom controls, not all of
      // them native inputs with a `name`).
      const firstCoreKey = Object.keys(fieldErrors)[0];
      const firstRoleKey = Object.keys(roleErrors)[0];
      const target = firstCoreKey
        ? formRef.current?.querySelector<HTMLElement>(`[name="${firstCoreKey}"]`)
        : firstRoleKey
          ? document.getElementById(`rolefield-${firstRoleKey}`)
          : null;
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      target?.focus?.();
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setFormError(
          body?.error ??
            "We could not send that just now. Please try again in a moment."
        );
        return;
      }

      setStatus("success");
      setValues(EMPTY);
      setRoleAnswers({});
      setRoleFieldErrors({});
      setErrors({});
    } catch {
      setStatus("error");
      setFormError(
        "Network error — check your connection and try again."
      );
    }
  }

  /* ---------------- Success state ---------------- */
  if (status === "success") {
    return (
      <section id="apply" className="scroll-mt-24 px-6 py-28 md:py-36">
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <Check size={26} strokeWidth={2.2} />
          </span>

          <h2 className="display text-balance text-[clamp(2rem,5vw,3.25rem)]">
            We have got it.
          </h2>

          <p className="mt-5 text-pretty leading-relaxed text-bone-muted">
            Your details are with us. We listen to everything that comes in and
            reply to the ones we want to hear more from — usually within two
            weeks.
          </p>

          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-9 min-h-11 rounded-full border border-line px-6 text-sm text-bone-muted transition-colors duration-[--dur-base] hover:border-bone/30 hover:text-bone"
          >
            Send another application
          </button>
        </div>
      </section>
    );
  }

  /* ---------------- Form ---------------- */
  return (
    <section id="apply" className="relative overflow-hidden scroll-mt-24 px-6 py-28 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 h-[30rem] w-[50rem] max-w-[130vw] -translate-x-1/2 rounded-full opacity-[0.13] blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-gold) 0%, transparent 68%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
        {/* Pitch column */}
        <Reveal>
          <h2 className="display text-balance text-[clamp(2.25rem,6vw,4rem)]">
            {apply.headingPrefix} <span className="font-deva text-gold">{site.nameDevanagari}</span>
          </h2>

          <p className="mt-6 max-w-md text-pretty leading-relaxed text-bone-muted">
            {apply.sub}
          </p>
        </Reveal>

        {/* Form column */}
        <Reveal
          as="div"
          className="rounded-2xl border border-line bg-ink-2/70 p-6 backdrop-blur-sm sm:p-9"
        >
          <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
            <Field
              label="Full name"
              name="name"
              required
              value={values.name}
              onChange={set("name")}
              onBlur={validateField("name")}
              error={errors.name}
              autoComplete="name"
              placeholder="Meera Raghunathan"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Email"
                name="email"
                type="email"
                required
                value={values.email}
                onChange={set("email")}
                onBlur={validateField("email")}
                error={errors.email}
                autoComplete="email"
                inputMode="email"
                placeholder="you@email.com"
              />

              <Field
                label="Phone"
                name="phone"
                type="tel"
                required
                value={values.phone}
                onChange={set("phone")}
                onBlur={validateField("phone")}
                error={errors.phone}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="City"
                name="city"
                required
                value={values.city}
                onChange={set("city")}
                onBlur={validateField("city")}
                error={errors.city}
                autoComplete="address-level2"
                placeholder="Mumbai"
              />

              <Field
                label="Country"
                name="country"
                required
                value={values.country}
                onChange={set("country")}
                onBlur={validateField("country")}
                error={errors.country}
                autoComplete="country-name"
                placeholder="India"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="mb-2 block text-sm font-medium text-bone">
                What do you do? <span className="text-gold">*</span>
              </label>

              <select
                id="role"
                name="role"
                required
                value={values.role}
                onChange={(e) => onRoleChange(e.target.value)}
                onBlur={validateField("role")}
                aria-invalid={!!errors.role}
                aria-describedby={errors.role ? "role-error" : undefined}
                className={`min-h-12 w-full appearance-none rounded-lg border bg-ink px-4 text-base text-bone outline-none transition-colors duration-[--dur-base] focus:border-gold ${
                  errors.role ? "border-danger" : "border-line hover:border-bone/25"
                }`}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23a8a2b4' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                }}
              >
                <option value="" disabled>
                  Select one
                </option>
                {applyRoles.map((r) => (
                  <option key={r.id} value={r.label}>
                    {r.label}
                  </option>
                ))}
              </select>

              {errors.role && <FieldError id="role-error">{errors.role}</FieldError>}
            </div>

            {values.role && (
              <ApplyRoleFields
                roleId={values.role}
                values={roleAnswers}
                errors={roleFieldErrors}
                onChange={setRoleAnswer}
              />
            )}

            <Field
              label="Instagram"
              name="instagram"
              required
              value={values.instagram}
              onChange={set("instagram")}
              onBlur={validateField("instagram")}
              error={errors.instagram}
              placeholder="@yourhandle"
            />

            {/* Message */}
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-bone">
                Anything else?{" "}
                <span className="font-normal text-bone-faint">Optional</span>
              </label>

              <textarea
                id="message"
                name="message"
                rows={4}
                value={values.message}
                onChange={(e) => set("message")(e.target.value)}
                onBlur={validateField("message")}
                maxLength={1500}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                placeholder="Tell us what you are working on, who you listen to, what you want from a label."
                className={`w-full resize-y rounded-lg border bg-ink px-4 py-3 text-base leading-relaxed text-bone outline-none transition-colors duration-[--dur-base] placeholder:text-bone-faint focus:border-gold ${
                  errors.message ? "border-danger" : "border-line hover:border-bone/25"
                }`}
              />

              {errors.message && (
                <FieldError id="message-error">{errors.message}</FieldError>
              )}
            </div>

            {/* Honeypot — hidden from humans and assistive tech alike. */}
            <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">Leave this field empty</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={(e) => set("website")(e.target.value)}
              />
            </div>

            {/* Form-level error */}
            {formError && (
              <p
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-danger/35 bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-gold px-8 text-sm font-semibold text-ink transition-[background-color,transform,opacity] duration-[--dur-base] ease-[--ease-out-quart] hover:bg-[#f0c75e] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send my application
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </>
              )}
            </button>

            <p className="text-center text-xs leading-relaxed text-bone-faint">
              We only use these details to get back to you about your music.
              Nothing is shared or sold.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Field primitives                                                   */
/* ------------------------------------------------------------------ */

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 flex items-start gap-1.5 text-xs text-danger"
    >
      <AlertCircle size={13} className="mt-px shrink-0" />
      {children}
    </p>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "url" | "text";
  placeholder?: string;
}) {
  const errorId = `${name}-error`;

  return (
    <div>
      {/* Visible label — never placeholder-only. */}
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-bone">
        {label}{" "}
        {required ? (
          <span className="text-gold" aria-hidden="true">
            *
          </span>
        ) : (
          hint && <span className="font-normal text-bone-faint">{hint}</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`min-h-12 w-full rounded-lg border bg-ink px-4 text-base text-bone outline-none transition-colors duration-[--dur-base] placeholder:text-bone-faint focus:border-gold ${
          error ? "border-danger" : "border-line hover:border-bone/25"
        }`}
        {...rest}
      />

      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
