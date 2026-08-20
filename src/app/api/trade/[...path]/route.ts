// Consolidated catch-all for /api/trade/* — replaces 7 individual route
// handlers so Vercel Hobby's 12-serverless-function limit is respected.
import { NextRequest } from "next/server";
import { dispatchApi } from "@/lib/api/dispatch";
import { routes } from "@/lib/api/handlers/trade";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return dispatchApi(routes, req, path);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return dispatchApi(routes, req, path);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return dispatchApi(routes, req, path);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return dispatchApi(routes, req, path);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return dispatchApi(routes, req, path);
}
