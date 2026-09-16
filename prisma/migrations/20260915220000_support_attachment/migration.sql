-- Support chat attachments stored in the database.
--
-- Used when Vercel Blob is not configured (no BLOB_READ_WRITE_TOKEN): the bytes
-- are persisted here and streamed back through /api/support/attachment/<id>,
-- so image uploads keep working on any host that has a database.

-- CreateTable
CREATE TABLE "SupportAttachment" (
    "id" TEXT NOT NULL,
    "userId" INTEGER,
    "filename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SupportAttachment_userId_idx" ON "SupportAttachment"("userId");

-- CreateIndex
CREATE INDEX "SupportAttachment_createdAt_idx" ON "SupportAttachment"("createdAt");
