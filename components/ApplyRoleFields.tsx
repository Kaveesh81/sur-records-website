"use client";

import { AlertCircle } from "lucide-react";
import { applyRoles, type RoleField } from "@/lib/content";
import FileUploadField from "./FileUploadField";

export type RoleAnswers = Record<string, string>;
export type RoleFieldErrors = Record<string, string>;

const OTHER_SUFFIX = "__other";
const LINK_SUFFIX = "__link";
const REQUIRED_MESSAGE = "This is required.";

function isVisible(field: RoleField, values: RoleAnswers): boolean {
  if (!field.showWhen) return true;
  return values[field.showWhen.key] === field.showWhen.equals;
}

function selectedOf(value: string | undefined): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

/**
 * Turns the raw in-progress `values` for a role into the flat {label, value}
 * pairs the API expects — resolving "Other" free text and dropping anything
 * hidden by a `showWhen` or left empty. Used by Apply.tsx at submit time.
 */
export function buildRoleAnswers(roleId: string, values: RoleAnswers): { label: string; value: string }[] {
  const role = applyRoles.find((r) => r.label === roleId);
  if (!role) return [];

  const out: { label: string; value: string }[] = [];

  for (const field of role.fields) {
    if (!isVisible(field, values)) continue;
    const raw = values[field.key];

    if (field.type === "upload-or-link") {
      const link = values[field.key + LINK_SUFFIX];
      const resolved = raw || link;
      if (resolved) out.push({ label: field.label, value: resolved });
      continue;
    }

    if (!raw) continue;

    if (field.type === "select") {
      const other = values[field.key + OTHER_SUFFIX];
      out.push({ label: field.label, value: raw === "Other" && other ? other : raw });
      continue;
    }

    if (field.type === "multiselect") {
      const other = values[field.key + OTHER_SUFFIX];
      const parts = selectedOf(raw).map((v) => (v === "Other" && other ? other : v));
      if (parts.length) out.push({ label: field.label, value: parts.join(", ") });
      continue;
    }

    out.push({ label: field.label, value: raw });
  }

  return out;
}

/**
 * Checks every `required` field that is currently visible (passes its
 * `showWhen`) and returns an error map for anything left empty. A field
 * marked `required` only actually blocks submission once its `showWhen`
 * condition reveals it — e.g. an upload only required after answering "Yes".
 */
export function validateRoleFields(roleId: string, values: RoleAnswers): RoleFieldErrors {
  const role = applyRoles.find((r) => r.label === roleId);
  if (!role) return {};

  const out: RoleFieldErrors = {};
  for (const field of role.fields) {
    if (!field.required || !isVisible(field, values)) continue;

    if (field.type === "upload-or-link") {
      const hasUpload = !!values[field.key]?.trim();
      const hasLink = !!values[field.key + LINK_SUFFIX]?.trim();
      if (!hasUpload && !hasLink) out[field.key] = "Upload a file or paste a link.";
      continue;
    }

    const raw = values[field.key];
    if (!raw || !raw.trim()) out[field.key] = REQUIRED_MESSAGE;
  }
  return out;
}

/**
 * Renders the follow-up fields for whichever role is currently selected on
 * the Contact form. Role → field list lives entirely in `applyRoles`
 * (lib/content.ts) — this component just interprets that data, so adding or
 * editing a role's questions never touches this file.
 */
export default function ApplyRoleFields({
  roleId,
  values,
  errors,
  onChange,
}: {
  roleId: string;
  values: RoleAnswers;
  errors?: RoleFieldErrors;
  onChange: (key: string, value: string) => void;
}) {
  const role = applyRoles.find((r) => r.label === roleId);
  if (!role || role.fields.length === 0) return null;

  return (
    <div className="space-y-5 border-t border-line pt-5">
      {role.fields.map((field) => {
        if (!isVisible(field, values)) return null;
        return (
          <RoleFieldInput
            key={field.key}
            field={field}
            values={values}
            error={errors?.[field.key]}
            onChange={onChange}
          />
        );
      })}
    </div>
  );
}

function RequiredMark({ required }: { required?: boolean }) {
  if (!required) return null;
  return (
    <span className="text-gold" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

function FieldErrorText({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="mt-2 flex items-start gap-1.5 text-xs text-danger">
      <AlertCircle size={13} className="mt-px shrink-0" />
      {error}
    </p>
  );
}

function RoleFieldInput({
  field,
  values,
  error,
  onChange,
}: {
  field: RoleField;
  values: RoleAnswers;
  error?: string;
  onChange: (key: string, value: string) => void;
}) {
  const value = values[field.key] ?? "";
  const otherKey = field.key + OTHER_SUFFIX;
  const borderClass = error ? "border-danger" : "border-line hover:border-bone/25";

  if (field.type === "text") {
    return (
      <div id={`rolefield-${field.key}`}>
        <label className="mb-2 block text-sm font-medium text-bone">
          {field.label}
          <RequiredMark required={field.required} />{" "}
          {field.hint && <span className="font-normal text-bone-faint">{field.hint}</span>}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          aria-invalid={!!error}
          className={`min-h-12 w-full rounded-lg border bg-ink px-4 text-base text-bone outline-none transition-colors duration-[--dur-base] placeholder:text-bone-faint focus:border-gold ${borderClass}`}
        />
        <FieldErrorText error={error} />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div id={`rolefield-${field.key}`}>
        <label className="mb-2 block text-sm font-medium text-bone">
          {field.label}
          <RequiredMark required={field.required} />{" "}
          {field.hint && <span className="font-normal text-bone-faint">{field.hint}</span>}
        </label>
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          aria-invalid={!!error}
          className={`w-full resize-y rounded-lg border bg-ink px-4 py-3 text-base leading-relaxed text-bone outline-none transition-colors duration-[--dur-base] placeholder:text-bone-faint focus:border-gold ${borderClass}`}
        />
        <FieldErrorText error={error} />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div id={`rolefield-${field.key}`}>
        <label className="mb-2 block text-sm font-medium text-bone">
          {field.label}
          <RequiredMark required={field.required} />
        </label>
        <select
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          aria-invalid={!!error}
          className={`min-h-12 w-full appearance-none rounded-lg border bg-ink px-4 text-base text-bone outline-none transition-colors duration-[--dur-base] focus:border-gold ${borderClass}`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23a8a2b4' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1rem center",
          }}
        >
          <option value="">Select one</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        {field.allowOther && value === "Other" && (
          <input
            type="text"
            value={values[otherKey] ?? ""}
            onChange={(e) => onChange(otherKey, e.target.value)}
            placeholder="Tell us more"
            className="mt-2 min-h-12 w-full rounded-lg border border-line bg-ink px-4 text-base text-bone outline-none transition-colors duration-[--dur-base] placeholder:text-bone-faint focus:border-gold hover:border-bone/25"
          />
        )}
        <FieldErrorText error={error} />
      </div>
    );
  }

  if (field.type === "yesno") {
    return (
      <div id={`rolefield-${field.key}`}>
        <label className="mb-2 block text-sm font-medium text-bone">
          {field.label}
          <RequiredMark required={field.required} />
        </label>
        <div className="flex gap-2">
          {["Yes", "No"].map((opt) => (
            <button
              key={opt}
              type="button"
              aria-pressed={value === opt}
              onClick={() => onChange(field.key, opt)}
              className={`min-h-11 flex-1 rounded-lg border text-sm font-medium transition-colors duration-[--dur-base] ${
                value === opt
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-line text-bone-muted hover:border-bone/25 hover:text-bone"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <FieldErrorText error={error} />
      </div>
    );
  }

  if (field.type === "multiselect") {
    const selected = new Set(selectedOf(value));

    const toggle = (opt: string) => {
      const next = new Set(selected);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      onChange(field.key, Array.from(next).join(","));
    };

    return (
      <div id={`rolefield-${field.key}`}>
        <label className="mb-2 block text-sm font-medium text-bone">
          {field.label}
          <RequiredMark required={field.required} />
        </label>

        {field.layout === "list" ? (
          <div className={`space-y-0.5 rounded-lg border ${borderClass}`}>
            {field.options?.map((opt) => {
              const active = selected.has(opt);
              return (
                <label
                  key={opt}
                  className="flex min-h-11 cursor-pointer items-center gap-3 border-b border-line px-4 text-sm text-bone last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggle(opt)}
                    className="h-4 w-4 shrink-0 accent-[color:var(--color-gold)]"
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {field.options?.map((opt) => {
              const active = selected.has(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(opt)}
                  className={`min-h-9 rounded-full border px-3.5 text-sm transition-colors duration-[--dur-base] ${
                    active
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-line text-bone-muted hover:border-bone/25 hover:text-bone"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {field.allowOther && selected.has("Other") && (
          <input
            type="text"
            value={values[otherKey] ?? ""}
            onChange={(e) => onChange(otherKey, e.target.value)}
            placeholder="Tell us more"
            className="mt-2.5 min-h-12 w-full rounded-lg border border-line bg-ink px-4 text-base text-bone outline-none transition-colors duration-[--dur-base] placeholder:text-bone-faint focus:border-gold hover:border-bone/25"
          />
        )}
        <FieldErrorText error={error} />
      </div>
    );
  }

  if (field.type === "upload") {
    return (
      <div id={`rolefield-${field.key}`}>
        <FileUploadField
          label={
            <>
              {field.label}
              <RequiredMark required={field.required} />
            </>
          }
          hint={field.hint}
          accept={field.accept}
          error={error}
          onUploaded={(url) => onChange(field.key, url ?? "")}
        />
      </div>
    );
  }

  if (field.type === "upload-or-link") {
    const linkKey = field.key + LINK_SUFFIX;
    return (
      <div id={`rolefield-${field.key}`}>
        <FileUploadField
          label={
            <>
              {field.label}
              <RequiredMark required={field.required} />
            </>
          }
          accept={field.accept}
          onUploaded={(url) => onChange(field.key, url ?? "")}
        />

        <div className="my-2.5 flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="label-mono !text-[0.65rem] text-bone-faint">or paste a link</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <input
          type="text"
          value={values[linkKey] ?? ""}
          onChange={(e) => onChange(linkKey, e.target.value)}
          placeholder="YouTube, Instagram, Google Drive…"
          aria-invalid={!!error}
          className={`min-h-12 w-full rounded-lg border bg-ink px-4 text-base text-bone outline-none transition-colors duration-[--dur-base] placeholder:text-bone-faint focus:border-gold ${borderClass}`}
        />
        <FieldErrorText error={error} />
      </div>
    );
  }

  return null;
}
