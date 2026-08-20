import type { ApiParams } from "@/lib/api/types";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Streams a support attachment straight from the server's disk.
//
// This is the LOCAL-DEV fallback path only. In production (Vercel) the upload
// route stores attachments in Vercel Blob and returns a full
// https://<store>.public.blob.vercel-storage.com/... URL, which the frontend
// renders directly — so no request ever reaches this route there.
const UPLOAD_DIR = path.join(process.cwd(), "support-uploads");
const TYPES: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };

export async function GET(_req: Request, params: ApiParams) {
  const { name } = params;
  // Reject anything that isn't a plain filename (no path traversal).
  if (!/^[A-Za-z0-9._-]+$/.test(name) || name.includes("..")) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }
  try {
    const bytes = await fs.readFile(path.join(UPLOAD_DIR, name));
    const ext = name.split(".").pop()?.toLowerCase() || "";
    const type = TYPES[ext] || "application/octet-stream";
    return new NextResponse(new Uint8Array(bytes), {
      headers: { "Content-Type": type, "Cache-Control": "private, max-age=3600" },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
