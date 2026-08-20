// src/lib/api/types.ts
// Shared types for the consolidated catch-all API routing.
//
// Every route handler under src/app/api used to be its own route.ts file, and
// therefore its own serverless function on Vercel (Hobby caps projects at 12).
// Handlers now live in src/lib/api/handlers/<group>/<name>.ts and are reached
// through a handful of catch-all routes (src/app/api/<group>/[...path]/route.ts
// and src/app/api/[...path]/route.ts) that dispatch on URL segments.
import type { NextRequest } from "next/server";

export type ApiParams = Record<string, string>;

// The request is typed as NextRequest (the runtime value Next.js passes) so
// handlers typed `(req: Request)`, `(req: NextRequest)` or `()` all fit:
// NextRequest is assignable to Request, and fewer-parameter functions are
// assignable, so no casts are needed in the route tables.
export type ApiHandler = (
  req: NextRequest,
  params: ApiParams
) => Promise<Response> | Response;

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiMethodHandlers = Partial<Record<ApiMethod, ApiHandler>>;

export interface ApiRouteEntry {
  /**
   * URL segments (after the group prefix) joined by "/". A segment starting
   * with ":" is a single dynamic segment, e.g. "users/:id" or "image/:name".
   * Matching is exact; ":" segments capture any one segment into params.
   */
  pattern: string;
  handlers: ApiMethodHandlers;
}

export type ApiRouteTable = ApiRouteEntry[];
