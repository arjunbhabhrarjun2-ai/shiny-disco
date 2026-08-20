import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const user = await prisma.user.findFirst({ where: { username } });
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
  return NextResponse.json({ token });
}
