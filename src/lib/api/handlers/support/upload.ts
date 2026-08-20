import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { put } from "@vercel/blob";

// Attachments are stored in Vercel Blob in production — the serverless
// filesystem is read-only and /tmp is ephemeral, so local disk cannot
// persist there. The DB only stores the served URL (embedded in the message
// content via [[img:URL]]), never the binary.
//
// Local development falls back to disk when BLOB_READ_WRITE_TOKEN is unset,
// keeping the old behavior (files under /support-uploads served through
// /api/support/image/<name>).
const UPLOAD_DIR = path.join(process.cwd(), "support-uploads");
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
};

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }
    const ext = ALLOWED[file.type];
    if (!ext) {
      return NextResponse.json(
        { success: false, message: "Only JPEG and PNG images are allowed" },
        { status: 400 },
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "Image must be under 5MB" }, { status: 400 });
    }

    const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`support/${name}`, bytes, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
      });
      return NextResponse.json({ success: true, url: blob.url });
    }

    // Dev-only fallback: no blob store configured → save to local disk.
    // Never attempt disk writes in production — the serverless filesystem is
    // read-only, so we fail loudly instead of returning a broken URL.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[support] BLOB_READ_WRITE_TOKEN not set — storing attachment on local disk (dev only).",
      );
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      await fs.writeFile(path.join(UPLOAD_DIR, name), bytes);
      return NextResponse.json({ success: true, url: `/api/support/image/${name}` });
    }

    return NextResponse.json(
      { success: false, message: "Image uploads are not configured (missing BLOB_READ_WRITE_TOKEN)." },
      { status: 503 },
    );
  } catch (error) {
    console.error("Support upload error:", error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
});
