/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
}

function readAll() {
  ensureStore();
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function writeAll(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

async function main() {
  const [, , emailArg, passwordArg, nameArg] = process.argv;
  const email = (emailArg || process.env.ADMIN_EMAIL || 'admin@goodtogreat.co.kr').toLowerCase().trim();
  const password = passwordArg || process.env.ADMIN_PASSWORD || 'g2g!admin2026';
  const name = (nameArg || process.env.ADMIN_NAME || '슈퍼관리자').trim();

  if (password.length < 8) {
    console.error('[seed-admin] 비밀번호는 8자 이상이어야 합니다.');
    process.exit(1);
  }

  const users = readAll();
  const passwordHash = await bcrypt.hash(password, 10);
  const idx = users.findIndex((u) => u.email.toLowerCase() === email);

  if (idx >= 0) {
    users[idx] = {
      ...users[idx],
      email,
      name,
      passwordHash,
      role: 'admin',
    };
    console.log(`[seed-admin] 기존 사용자 갱신: ${email}`);
  } else {
    users.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      email,
      name,
      passwordHash,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    console.log(`[seed-admin] 슈퍼어드민 생성: ${email}`);
  }

  writeAll(users);
  console.log('[seed-admin] 자격증명:');
  console.log(`  email   : ${email}`);
  console.log(`  password: ${password}`);
  console.log(`  name    : ${name}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
