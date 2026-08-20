import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { handleApiError } from "@/lib/errorHandler";

// Server-side admin check. The client sends its Bearer token; only a verified
// admin (role === "admin") gets { isAdmin: true }.
export async function GET(req: Request) {
  try {
    const auth = requireAdmin(req);
    return NextResponse.json({ isAdmin: true, email: auth.email });
  } catch (error) {
    return handleApiError(error);
  }
}
