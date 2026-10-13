import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/common/Button';
import { getAllPosts, formatDate, extractPlainText } from '@/lib/posts';

export const metadata: Metadata = {
  title: '리뷰이야기 — 쿠팡/스마트스토어 리뷰체험단·가구매·상위노출 노하우',
  description:
    '쿠팡 리뷰, 스마트스토어 리뷰, 가구매, 상위노출 등 리뷰체험단 운영 노하우와 캠페인 후기를 모아 두는 공간입니다.',
  keywords: [
    '리뷰체험단',
    '쿠팡 리뷰',
    '스스 리뷰',
    '스마트스토어 리뷰',
    '가구매',
    '쿠팡 상위노출',
    '스스 상위노출',
    '구매리뷰',
  ],
  alternates: { canonical: '/blog' },
};

export const dynamic = 'force-dynamic';

interface BlogListPageProps {
  searchParams: { tag?: string };
}

export default async function BlogListPage({ searchParams }: BlogListPageProps): Promise<JSX.Element> {
  const all = await getAllPosts();
  const activeTag = searchParams.tag?.trim() ?? '';
  const posts = activeTag
    ? all.filter((p) => p.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase()))
    : all;

  const allTags = Array.from(new Set(all.flatMap((p) => p.tags))).sort();

  return (
    <>
      <Header />
      <main className="bg-white">
        <div className="container-x py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="eyebrow">리뷰이야기</span>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  리뷰 운영 이야기
                </h1>
                <p className="mt-3 text-sm text-ink-500">
                  리뷰체험단 운영 노하우, 캠페인 후기, 자유로운 이야기를 남겨주세요.
                </p>
              </div>
              <Button href="/blog/new" variant="primary" size="md">
                글쓰기
              </Button>
            </div>

            {allTags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-1.5">
                <Link
                  href="/blog"
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    activeTag
                      ? 'bg-ink-100 text-ink-700 hover:bg-ink-100/70'
                      : 'bg-ink-900 text-white'
                  }`}
                >
                  전체
                </Link>
                {allTags.map((tag) => {
                  const isActive = tag.toLowerCase() === activeTag.toLowerCase();
                  return (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-ink-900 text-white'
                          : 'bg-ink-100 text-ink-700 hover:bg-ink-100/70'
                      }`}
                    >
                      #{tag}
                    </Link>
                  );
                })}
              </div>
            )}

            {posts.length === 0 ? (
              <div className="mt-12 rounded-2xl border border-dashed border-ink-100 bg-ink-100/30 p-16 text-center">
                <div className="text-sm font-semibold text-ink-500">
                  {activeTag ? `#${activeTag} 태그의 글이 없습니다.` : '아직 작성된 글이 없습니다.'}
                </div>
                <p className="mt-2 text-xs text-ink-500">
                  {activeTag ? '다른 태그를 선택해 보세요.' : '첫 번째 이야기를 남겨주세요.'}
                </p>
              </div>
            ) : (
              <ul className="mt-8 divide-y divide-ink-100 border-t border-ink-100">
                {posts.map((post) => (
                  <li key={post.id} className="py-6">
                    <Link href={`/blog/${post.id}`} className="group block">
                      <h2 className="text-lg font-bold text-ink-900 group-hover:underline">
                        {post.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm text-ink-500">
                        {extractPlainText(post.content)}
                      </p>
                    </Link>
                    {post.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
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
                    <div className="mt-3 flex items-center gap-3 text-xs text-ink-500">
                      <span className="font-semibold text-ink-700">{post.author}</span>
                      <span>·</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
