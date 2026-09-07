import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { findUserByIdentifier } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Accept email or username.
  const user = await findUserByIdentifier(email);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const passwordOk = await bcrypt.compare(password, user.password);
  if (!passwordOk) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Password verified. Do NOT create session yet.
  return NextResponse.json({ passwordVerified: true });
}
