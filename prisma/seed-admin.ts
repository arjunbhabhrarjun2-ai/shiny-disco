import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcrypt';

// Credentials are env-overridable so the same script works for local dev and
// for seeding the production (Neon) database without committing real secrets.
// Defaults preserve the original Copenhangen admin account.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Copenhangen';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ForeverPaid$8000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'copenhangen@kandella.net';
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || ADMIN_USERNAME;

async function main() {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username: ADMIN_USERNAME }, { email: ADMIN_EMAIL }],
    },
  });
  if (existing) {
    console.log(
      `Admin user already exists (${existing.username} / ${existing.email}, role=${existing.role}). Skipping.`,
    );
    return;
  }
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.user.create({
    data: {
      username: ADMIN_USERNAME,
      firstName: ADMIN_FIRST_NAME,
      lastName: 'Admin',
      email: ADMIN_EMAIL,
      password: hash,
      role: 'admin',
    },
  });
  console.log(`Admin user "${ADMIN_USERNAME}" created with role admin.`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
