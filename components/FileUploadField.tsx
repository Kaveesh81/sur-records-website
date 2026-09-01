"use client";

import { useRef, useState, type ReactNode } from "react";
import { upload } from "@vercel/blob/client";
import { AlertCircle, CheckCircle2, Loader2, Paperclip, X } from "lucide-react";

type Status = "idle" | "uploading" | "done" | "error";

/**
 * A single file-upload field, styled to match the rest of the form.
 * Uploads go straight from the browser to Vercel Blob storage (via
 * /api/upload issuing a short-lived client token) — never through our own
 * serverless function, so large audio/video files never hit a body-size
 * limit. `onUploaded` receives the resulting public URL, or `null` if the
 * file is removed.
 *
 * `error` is an external validation error (e.g. "this is required") set by
 * the parent form on submit — distinct from an upload actually failing,
 * which is tracked internally and never blocks the rest of the form.
 */
export default function FileUploadField({
  label,
  hint,
  accept,
  error,
  onUploaded,
}: {
  label: ReactNode;
  hint?: string;
  accept?: string;
  error?: string;
  onUploaded: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onPick = () => inputRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setFileName(file.name);
    setProgress(0);
    setUploadError(null);

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      });
      setStatus("done");
      onUploaded(blob.url);
    } catch {
      setStatus("error");
      setUploadError("Could not upload that file. Please try again.");
      onUploaded(null);
    }
  };

  const clear = () => {
    setStatus("idle");
    setFileName(null);
    setProgress(0);
    setUploadError(null);
    onUploaded(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-bone">
        {label} {hint && <span className="font-normal text-bone-faint">{hint}</span>}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onFileChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      {status === "idle" && (
        <button
          type="button"
          onClick={onPick}
          aria-invalid={!!error}
          className={`flex min-h-12 w-full items-center gap-2.5 rounded-lg border bg-ink px-4 text-sm text-bone-muted outline-none transition-colors duration-[--dur-base] focus-visible:border-gold ${
            error ? "border-danger" : "border-line hover:border-bone/25"
          }`}
        >
          <Paperclip size={15} className="shrink-0" />
          Choose a file
        </button>
      )}

      {status === "uploading" && (
        <div className="flex min-h-12 w-full items-center gap-2.5 rounded-lg border border-line bg-ink px-4 text-sm text-bone-muted">
          <Loader2 size={15} className="shrink-0 animate-spin" />
          <span className="truncate">{fileName}</span>
          <span className="ml-auto shrink-0 tabular">{Math.round(progress)}%</span>
        </div>
      )}

      {status === "done" && (
        <div className="flex min-h-12 w-full items-center gap-2.5 rounded-lg border border-gold/40 bg-gold/[0.06] px-4 text-sm text-bone">
          <CheckCircle2 size={15} className="shrink-0 text-gold" />
          <span className="truncate">{fileName}</span>
          <button
            type="button"
            onClick={clear}
            aria-label="Remove file"
            className="ml-auto inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-bone-faint transition-colors duration-[--dur-fast] hover:bg-bone/10 hover:text-bone"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {status === "error" && (
        <button
          type="button"
          onClick={onPick}
          className="flex min-h-12 w-full items-center gap-2.5 rounded-lg border border-danger/40 bg-danger/[0.06] px-4 text-sm text-danger"
        >
          <Paperclip size={15} className="shrink-0" />
          Try again
        </button>
      )}

      {uploadError && (
        <p role="alert" className="mt-2 flex items-start gap-1.5 text-xs text-danger">
          <AlertCircle size={13} className="mt-px shrink-0" />
          {uploadError}
        </p>
      )}

      {!uploadError && error && (
        <p role="alert" className="mt-2 flex items-start gap-1.5 text-xs text-danger">
          <AlertCircle size={13} className="mt-px shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
