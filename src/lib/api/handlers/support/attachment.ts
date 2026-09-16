import type { ApiParams } from "@/lib/api/types";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Streams a support attachment that is stored in the database.
//
// This is the fallback used when Vercel Blob is not configured: /api/support/upload
// persists the bytes in SupportAttachment and returns this URL, which the chat
// renders inside an <img>. The id is 48 random hex characters, so it works as the
// capability in the URL — an <img> request cannot carry a bearer token, exactly
// like the public Blob URL it replaces. Only image types are ever served, and the
// bytes are stored with the content type the uploader passed the upload validator.
const SERVABLE: Record<string, string> = {
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/png": "image/png",
};

export async function GET(_req: Request, params: ApiParams) {
  const { id } = params;
  // 48-char lowercase hex, nothing else — no traversal, no guessing.
  if (!/^[a-f0-9]{32,64}$/.test(id || "")) {
    return NextResponse.json({ error: "Invalid attachment" }, { status: 400 });
  }

  try {
    const row = await prisma.supportAttachment.findUnique({ where: { id } });
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const type = SERVABLE[row.contentType];
    if (!type) return NextResponse.json({ error: "Unsupported attachment" }, { status: 415 });

    return new NextResponse(new Uint8Array(row.data), {
      headers: {
        "Content-Type": type,
        "Content-Length": String(row.size),
        // Attachments are immutable (unique id), so they can be cached hard.
        "Cache-Control": "private, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": `inline; filename="${row.filename.replace(/[^A-Za-z0-9._-]/g, "")}"`,
      },
    });
  } catch (error) {
    console.error("[support] attachment read failed:", error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
