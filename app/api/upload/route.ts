import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Issues short-lived client tokens for direct browser -> Vercel Blob
 * uploads (see components/FileUploadField.tsx). The file bytes never pass
 * through this route or through /api/apply — only the resulting public URL
 * does, so large audio/video demos never hit a serverless body-size limit.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "audio/*",
          "video/*",
          "image/*",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        maximumSizeInBytes: 200 * 1024 * 1024, // 200MB — generous for demo-quality audio/video
        addRandomSuffix: true,
      }),
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    console.error("[upload] Failed to issue upload token:", err);
    return NextResponse.json(
      { error: (err as Error).message ?? "Upload is not configured." },
      { status: 400 }
    );
  }
}
