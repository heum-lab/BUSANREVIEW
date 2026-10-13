import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/common/Button';
import { TagInput } from '@/components/blog/TagInput';
import { RichTextEditor } from '@/components/blog/RichTextEditor';
import { getCurrentUser } from '@/lib/auth';
import { getPostById } from '@/lib/posts';
import { updatePostAction, deletePostAction } from './actions';

export const metadata: Metadata = {
  title: '글 수정 — 리뷰이야기',
};

interface EditPageProps {
  params: { id: string };
  searchParams: { error?: string };
}

export default async function EditPostPage({ params, searchParams }: EditPageProps): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=/blog/${params.id}/edit`);
  }

  const post = await getPostById(params.id);
  if (!post) notFound();

  const showError = searchParams.error === 'missing';

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
              <Link href={`/blog/${post.id}`} className="hover:text-ink-900">
                {post.title}
              </Link>
              <span>·</span>
              <span className="text-ink-900">수정</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">글 수정</h1>
            <p className="mt-3 text-sm text-ink-500">
              <span className="font-semibold text-ink-700">{post.author}</span>님의 글을 수정합니다.
            </p>

            {showError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                제목과 내용은 필수입니다.
              </div>
            )}

            <form action={updatePostAction} className="mt-10 space-y-6">
              <input type="hidden" name="id" value={post.id} />

              <div>
                <label htmlFor="title" className="text-sm font-semibold text-ink-700">
                  제목 <span className="text-brand-600">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  maxLength={120}
                  defaultValue={post.title}
                  placeholder="제목을 입력해 주세요"
                  className="mt-1.5 w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-ink-700">태그</label>
                <div className="mt-1.5">
                  <TagInput name="tags" initialTags={post.tags} />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-ink-700">
                  내용 <span className="text-brand-600">*</span>
                </label>
                <div className="mt-1.5">
                  <RichTextEditor name="content" initialHtml={post.content} />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <DeleteForm postId={post.id} />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button href={`/blog/${post.id}`} variant="ghost" size="md">
                    취소
                  </Button>
                  <Button type="submit" variant="primary" size="md">
                    수정 완료
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function DeleteForm({ postId }: { postId: string }): JSX.Element {
  return (
    <form action={deletePostAction}>
      <input type="hidden" name="id" value={postId} />
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
      >
        글 삭제
      </button>
    </form>
  );
}
