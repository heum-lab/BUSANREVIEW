import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { findUserById, type PublicUser } from './users';

const COOKIE_NAME = 'g2g_session';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? 'dev-only-secret-change-me-please-use-32-chars-min',
);

interface SessionPayload {
  userId: string;
}

async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE_SECONDS}s`)
    .sign(SECRET);
}

async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (typeof payload.userId !== 'string') return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export async function setSession(userId: string): Promise<void> {
  const token = await signSession({ userId });
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export async function clearSession(): Promise<void> {
  cookies().delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySession(token);
  if (!session) return null;
  return findUserById(session.userId);
}
