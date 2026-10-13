import 'server-only';
import { put, list, head, del, BlobNotFoundError } from '@vercel/blob';

// Storage layout on the (eventually consistent) public Blob store:
//   consultations/items/<id>.json   — one immutable record per consultation
//   consultations/handled/<id>      — marker blob; its EXISTENCE means "handled"
//
// Status is intentionally NOT stored by overwriting the record's JSON. The
// public store takes ~5s to make an overwritten blob's CONTENT readable, so
// toggling status that way showed stale data right after a refresh. By contrast
// `list()` reflects blob creation/deletion almost immediately (<1s), so we model
// the handled flag as a marker blob and derive status from a `list()` of the
// handled/ prefix — giving near-instant read-after-write for the admin toggle.
const ITEMS = 'consultations/items/';
const HANDLED = 'consultations/handled/';
const itemPath = (id: string): string => `${ITEMS}${id}.json`;
const handledPath = (id: string): string => `${HANDLED}${id}`;

export type ConsultationStatus = 'pending' | 'handled';

export interface Consultation {
  id: string;
  brand: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: ConsultationStatus;
  createdAt: string;
  handledAt?: string;
}

export type NewConsultationInput = Pick<Consultation, 'brand' | 'name' | 'phone' | 'email' | 'message'>;

const JSON_PUT_OPTS = {
  access: 'public',
  addRandomSuffix: false,
  allowOverwrite: true,
  contentType: 'application/json',
  cacheControlMaxAge: 0,
} as const;

const MARKER_PUT_OPTS = {
  access: 'public',
  addRandomSuffix: false,
  allowOverwrite: true,
  contentType: 'text/plain',
  cacheControlMaxAge: 0,
} as const;

// Fetch a record's JSON via downloadUrl (bypasses the CDN edge cache) + nonce.
async function fetchRecord(downloadUrl: string): Promise<Consultation | null> {
  const sep = downloadUrl.includes('?') ? '&' : '?';
  const res = await fetch(`${downloadUrl}${sep}t=${Date.now()}-${Math.random().toString(36).slice(2)}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return (await res.json()) as Consultation;
}

// id -> handledAt (ISO), built from the handled/ marker blobs via list().
async function handledMap(): Promise<Map<string, string>> {
  const { blobs } = await list({ prefix: HANDLED });
  const m = new Map<string, string>();
  for (const b of blobs) {
    m.set(b.pathname.slice(HANDLED.length), b.uploadedAt.toISOString());
  }
  return m;
}

function withStatus(c: Consultation, handled: Map<string, string>): Consultation {
  const handledAt = handled.get(c.id);
  return handledAt
    ? { ...c, status: 'handled', handledAt }
    : { ...c, status: 'pending', handledAt: undefined };
}

export async function getAllConsultations(): Promise<Consultation[]> {
  const [itemsList, handled] = await Promise.all([list({ prefix: ITEMS }), handledMap()]);
  const records = await Promise.all(itemsList.blobs.map((b) => fetchRecord(b.downloadUrl)));
  return records
    .filter((c): c is Consultation => c !== null)
    .map((c) => withStatus(c, handled))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getConsultationById(id: string): Promise<Consultation | null> {
  try {
    const blob = await head(itemPath(id));
    const record = await fetchRecord(blob.downloadUrl);
    if (!record) return null;
    return withStatus(record, await handledMap());
  } catch (err) {
    if (err instanceof BlobNotFoundError) return null;
    throw err;
  }
}

export async function createConsultation(input: NewConsultationInput): Promise<Consultation> {
  const item: Consultation = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    brand: input.brand.trim(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email.trim().toLowerCase(),
    message: input.message.trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  await put(itemPath(item.id), JSON.stringify(item), JSON_PUT_OPTS);
  return item;
}

export async function setConsultationStatus(id: string, status: ConsultationStatus): Promise<void> {
  if (status === 'handled') {
    await put(handledPath(id), '1', MARKER_PUT_OPTS);
  } else {
    try {
      await del(handledPath(id));
    } catch (err) {
      if (!(err instanceof BlobNotFoundError)) throw err;
    }
  }
}

export async function deleteConsultation(id: string): Promise<void> {
  await Promise.all([
    del(itemPath(id)).catch((e) => {
      if (!(e instanceof BlobNotFoundError)) throw e;
    }),
    del(handledPath(id)).catch((e) => {
      if (!(e instanceof BlobNotFoundError)) throw e;
    }),
  ]);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
}
