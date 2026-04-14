import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getAdminCredentials, upsertAdminCredentials } from '@/lib/db';

export const COOKIE_NAME = 'admin_session';
export const SESSION_DURATION = 60 * 60 * 24; // 24 hours in seconds
const PASSWORD_HASH_ALGORITHM = 'scrypt';
const SCRYPT_KEY_LENGTH = 64;
const scrypt = promisify(scryptCallback);

type ActiveAdminCredentials =
  | { source: 'database'; email: string; passwordHash: string }
  | { source: 'environment'; email: string; password: string };

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET env var is not set');
  return new TextEncoder().encode(secret);
}

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());
  return token;
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getSessionToken();
  if (!token) return false;
  return verifySession(token);
}

function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getEnvAdminCredentials(): ActiveAdminCredentials | null {
  const envEmail = process.env.ADMIN_EMAIL ?? process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envEmail || !envPassword) return null;

  return {
    source: 'environment',
    email: normalizeAdminEmail(envEmail),
    password: envPassword,
  };
}

async function getActiveAdminCredentials(): Promise<ActiveAdminCredentials | null> {
  const databaseCredentials = await getAdminCredentials();
  if (databaseCredentials) {
    return {
      source: 'database',
      email: normalizeAdminEmail(databaseCredentials.email),
      passwordHash: databaseCredentials.passwordHash,
    };
  }

  return getEnvAdminCredentials();
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const key = (await scrypt(password, salt, SCRYPT_KEY_LENGTH)) as Buffer;
  return `${PASSWORD_HASH_ALGORITHM}$${salt}$${key.toString('hex')}`;
}

async function verifyHashedPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, salt, hashHex] = storedHash.split('$');
  if (algorithm !== PASSWORD_HASH_ALGORITHM || !salt || !hashHex) return false;
  if (!/^[a-fA-F0-9]+$/.test(hashHex)) return false;

  const storedKey = Buffer.from(hashHex, 'hex');
  const candidateKey = (await scrypt(password, salt, SCRYPT_KEY_LENGTH)) as Buffer;

  if (storedKey.length !== candidateKey.length) return false;
  return timingSafeEqual(storedKey, candidateKey);
}

export async function checkCredentials(email: string, password: string): Promise<boolean> {
  const normalizedEmail = normalizeAdminEmail(email);
  if (!normalizedEmail || !password) return false;

  const credentials = await getActiveAdminCredentials();
  if (!credentials) return false;
  if (normalizedEmail !== credentials.email) return false;

  if (credentials.source === 'database') {
    return verifyHashedPassword(password, credentials.passwordHash);
  }

  return password === credentials.password;
}

export async function getAdminLoginEmail(): Promise<string | null> {
  const credentials = await getActiveAdminCredentials();
  return credentials?.email ?? null;
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;

  const credentials = await getActiveAdminCredentials();
  if (!credentials) return false;

  if (credentials.source === 'database') {
    return verifyHashedPassword(password, credentials.passwordHash);
  }

  return password === credentials.password;
}

export async function updateAdminCredentials(email: string, password: string): Promise<void> {
  const normalizedEmail = normalizeAdminEmail(email);
  const passwordHash = await hashPassword(password);
  await upsertAdminCredentials(normalizedEmail, passwordHash);
}
