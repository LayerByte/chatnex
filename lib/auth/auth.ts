import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@/lib/db/prisma';

function getSecret() {
  const value = process.env.CHATNEX_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('CHATNEX_SESSION_SECRET must contain at least 32 characters.');
  return new TextEncoder().encode(value);
}

export async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const existing = await db.admin.findUnique({ where: { email } });
  if (!existing) await db.admin.create({ data: { email, passwordHash: await bcrypt.hash(password, 12) } });
}

export async function login(email: string, password: string) {
  await ensureAdmin();
  const normalized = email.trim().toLowerCase();
  const admin = await db.admin.findUnique({ where: { email: normalized } });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) return false;
  const token = await new SignJWT({ sub: admin.id, email: admin.email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('8h').sign(getSecret());
  (await cookies()).set('chatnex_admin', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 28800, path: '/' });
  return true;
}

export async function isAdmin() {
  const token = (await cookies()).get('chatnex_admin')?.value;
  if (!token) return false;
  try { await jwtVerify(token, getSecret()); return true; } catch { return false; }
}

export async function logout() { (await cookies()).delete('chatnex_admin'); }
