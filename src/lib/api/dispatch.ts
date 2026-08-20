// src/lib/api/dispatch.ts
// Core dispatcher for the consolidated catch-all API routes.
//
// Each catch-all route file (src/app/api/<group>/[...path]/route.ts) exports
// GET/POST/PUT/PATCH/DELETE that all funnel into dispatchApi() with the group's
// route table. dispatchApi() matches the URL segments against each entry's
// pattern, extracts named params ("users/:id" -> { id }), and calls the
// method handler. It reproduces Next.js's normal 404/405 behavior.
import { NextRequest, NextResponse } from "next/server";
import type {
  ApiMethod,
  ApiParams,
  ApiRouteTable,
} from "./types";

const METHODS: ApiMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

/** Match "users/:id" against ["users", "5"] -> { id: "5" }, or null. */
function matchPattern(pattern: string, path: string[]): ApiParams | null {
  const parts = pattern.split("/");
  if (parts.length !== path.length) return null;
  const params: ApiParams = {};
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith(":")) {
      params[part.slice(1)] = path[i];
    } else if (part !== path[i]) {
      return null;
    }
  }
  return params;
}

export async function dispatchApi(
  table: ApiRouteTable,
  req: NextRequest,
  path: string[]
): Promise<Response> {
  // HEAD behaves like GET (Next.js does the same for route handlers).
  const method =
    req.method === "HEAD"
      ? "GET"
      : ((req.method ?? "GET").toUpperCase() as ApiMethod);

  for (const entry of table) {
    const params = matchPattern(entry.pattern, path);
    if (!params) continue;

    const handler = entry.handlers[method];
    if (!handler) {
      return NextResponse.json(
        { error: "Method not allowed" },
        {
          status: 405,
          headers: {
            Allow: METHODS.filter((m) => entry.handlers[m]).join(", "),
          },
        }
      );
    }

    try {
      return await handler(req, params);
    } catch (error) {
      // Handlers normally catch their own errors (handleApiError). This is a
      // safety net so one bad handler can never crash the whole catch-all.
      console.error("[api] unhandled handler error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
