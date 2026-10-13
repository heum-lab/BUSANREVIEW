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

// 프로덕션(Vercel)은 파일시스템이 읽기 전용이고 data/users.json은 git에서 제외되어 배포에 포함되지 않는다.
// 그래서 AUTH_USERS_JSON 환경변수(= users.json 내용 그대로)를 우선 사용하고, 없으면 로컬 파일을 읽는다.
function readFromEnv(): StoredUser[] | null {
  const raw = process.env.AUTH_USERS_JSON?.replace(/^\uFEFF/, '').trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    console.error('[users] AUTH_USERS_JSON 파싱 실패', err);
    return null;
  }
}

async function readAll(): Promise<StoredUser[]> {
  const fromEnv = readFromEnv();
  if (fromEnv) return fromEnv;
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(raw) as StoredUser[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}

async function writeAll(users: StoredUser[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
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
