import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
}

async function ensureStore(): Promise<void> {
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(USERS_FILE, '[]', 'utf-8');
  }
}

async function readAll(): Promise<StoredUser[]> {
  await ensureStore();
  const raw = await fs.readFile(USERS_FILE, 'utf-8');
  return JSON.parse(raw) as StoredUser[];
}

async function writeAll(users: StoredUser[]): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const users = await readAll();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findUserById(id: string): Promise<PublicUser | null> {
  const users = await readAll();
  const u = users.find((u) => u.id === id);
  if (!u) return null;
  return { id: u.id, email: u.email, name: u.name };
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}

export async function createUser(input: CreateUserInput): Promise<PublicUser> {
  const users = await readAll();
  const passwordHash = await bcrypt.hash(input.password, 10);
  const user: StoredUser = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    email: input.email.toLowerCase().trim(),
    name: input.name.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeAll(users);
  return { id: user.id, email: user.email, name: user.name };
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
