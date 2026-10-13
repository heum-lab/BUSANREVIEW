/* eslint-disable @typescript-eslint/no-var-requires */
// One-time migration: uploads local data/posts.json to Vercel Blob at posts/all.json.
// Requires BLOB_READ_WRITE_TOKEN in env (copy from the Vercel project's Blob store).
// Usage:
//   BLOB_READ_WRITE_TOKEN=... node scripts/migrate-posts-to-blob.js

const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error('[migrate] BLOB_READ_WRITE_TOKEN 환경변수가 필요합니다.');
    process.exit(1);
  }

  const file = path.join(process.cwd(), 'data', 'posts.json');
  if (!fs.existsSync(file)) {
    console.error(`[migrate] ${file} 파일이 없습니다.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(file, 'utf-8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    console.error('[migrate] data/posts.json 의 최상위가 배열이 아닙니다.');
    process.exit(1);
  }

  const result = await put('posts/all.json', JSON.stringify(parsed, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 0,
    token,
  });

  console.log(`[migrate] 업로드 완료 (${parsed.length}건)`);
  console.log(`  url: ${result.url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
