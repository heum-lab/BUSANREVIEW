import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/common/Button';
import { getCurrentUser } from '@/lib/auth';
import { getPostById, formatDate, extractPlainText } from '@/lib/posts';

interface PostDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const post = await getPostById(params.id);
  if (!post) return { title: '리뷰이야기' };
  const description = extractPlainText(post.content, 150);
  return {
    title: `${post.title} — 리뷰이야기`,
    description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.id}` },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url: `/blog/${post.id}`,
      publishedTime: post.createdAt,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function PostDetailPage({ params }: PostDetailPageProps): Promise<JSX.Element> {
  const post = await getPostById(params.id);
  if (!post) notFound();

  const user = await getCurrentUser();
  const canEdit = Boolean(user);

  return (
    <>
      <Header />
      <main className="bg-white">
        <div className="container-x py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3 text-sm text-ink-500">
              <Link href="/blog" className="hover:text-ink-900">
                리뷰이야기
              </Link>
              <span>·</span>
              <span className="text-ink-900">상세</span>
            </div>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{post.title}</h1>
              {canEdit && (
                <Link
                  href={`/blog/${post.id}/edit`}
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-ink-100 bg-white px-4 text-sm font-semibold text-ink-900 hover:bg-ink-100/50"
                >
                  수정
                </Link>
              )}
            </div>

            {post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-700 transition-colors hover:bg-ink-900 hover:text-white"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-3 text-sm text-ink-500">
              <span className="font-semibold text-ink-700">{post.author}</span>
              <span>·</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>

            <article
              className="post-prose mt-10 text-base"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-14 flex flex-col gap-3 border-t border-ink-100 pt-8 sm:flex-row sm:justify-between">
              <Button href="/blog" variant="ghost" size="md">
                목록으로
              </Button>
              <Button href="/blog/new" variant="primary" size="md">
                새 글 작성
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
