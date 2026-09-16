import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

// Support chat attachments. Three storage backends, tried in order:
//
//   1. Vercel Blob  — when BLOB_READ_WRITE_TOKEN is set (CDN-backed, public URL).
//   2. Postgres     — when it is NOT set. The bytes go into SupportAttachment and
//                     are streamed back through /api/support/attachment/<id>.
//                     This is what makes uploads work on a deploy that has no
//                     Blob store attached (the serverless filesystem is
//                     read-only and /tmp is ephemeral, so disk cannot persist).
//   3. Local disk   — development only, when the database write is unavailable.
//
// Only the resulting URL is stored in the message body (embedded as [[img:URL]]);
// the client renders whatever URL comes back, so all three are transparent.
const UPLOAD_DIR = path.join(process.cwd(), "support-uploads");
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
};

export const POST = withAuth(async (req: NextRequest, user) => {
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

    /* ── 1. Vercel Blob (preferred when configured) ── */
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`support/${name}`, bytes, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
      });
      return NextResponse.json({ success: true, url: blob.url });
    }

    /* ── 2. Database fallback (any host with a database) ── */
    try {
      const id = randomBytes(24).toString("hex");
      await prisma.supportAttachment.create({
        data: {
          id,
          userId: user?.userId ? Number(user.userId) : null,
          filename: name,
          contentType: file.type,
          size: file.size,
          data: bytes,
        },
      });
      return NextResponse.json({ success: true, url: `/api/support/attachment/${id}` });
    } catch (dbError) {
      console.error("[support] attachment DB store failed:", dbError);
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { success: false, message: "Image uploads are temporarily unavailable. Please try again." },
          { status: 503 },
        );
      }
    }

    /* ── 3. Dev-only disk fallback ── */
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), bytes);
    return NextResponse.json({ success: true, url: `/api/support/image/${name}` });
  } catch (error) {
    console.error("Support upload error:", error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
});
