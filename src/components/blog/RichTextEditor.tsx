'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { useRef, useState } from 'react';
import { uploadImageAction } from '@/app/blog/new/upload';

interface RichTextEditorProps {
  name: string;
  initialHtml?: string;
  placeholder?: string;
}

export function RichTextEditor({
  name,
  initialHtml = '',
  placeholder = '내용을 입력해 주세요',
}: RichTextEditorProps): JSX.Element {
  const [html, setHtml] = useState(initialHtml);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-brand-600 underline underline-offset-2' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'my-4 rounded-xl max-w-full h-auto' },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder }),
    ],
    content: initialHtml,
    onUpdate: ({ editor: e }) => setHtml(e.getHTML()),
    editorProps: {
      attributes: {
        class:
          'tiptap-editor min-h-[300px] px-4 py-3 text-sm leading-relaxed focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return (
      <div className="rounded-xl border border-ink-100 bg-white">
        <div className="h-12 border-b border-ink-100" />
        <div className="min-h-[300px] px-4 py-3 text-sm text-ink-300">로딩 중…</div>
        <input type="hidden" name={name} value="" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-ink-100 bg-white focus-within:border-brand-500">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const setLink = (): void => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('링크 URL을 입력하세요', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertImageByUrl = (): void => {
    const url = window.prompt('이미지 URL을 입력하세요', 'https://');
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const pickFile = (): void => {
    fileInputRef.current?.click();
  };

  const insertTable = (): void => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const inTable = editor.isActive('table');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const result = await uploadImageAction(fd);
      if (result.url) {
        editor.chain().focus().setImage({ src: result.url }).run();
      } else {
        window.alert(result.error ?? '업로드 실패');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="sticky top-20 z-30 flex flex-wrap items-center gap-1 rounded-t-xl border-b border-ink-100 bg-white/95 p-2 backdrop-blur">
      <ToolButton
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        label="굵게"
      >
        <span className="font-bold">B</span>
      </ToolButton>
      <ToolButton
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        label="기울임"
      >
        <span className="italic">I</span>
      </ToolButton>
      <ToolButton
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        label="취소선"
      >
        <span className="line-through">S</span>
      </ToolButton>
      <Divider />
      <ToolButton
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        label="제목 1"
      >
        H2
      </ToolButton>
      <ToolButton
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        label="제목 2"
      >
        H3
      </ToolButton>
      <Divider />
      <ToolButton
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        label="글머리 기호"
      >
        • 목록
      </ToolButton>
      <ToolButton
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        label="번호 매기기"
      >
        1. 목록
      </ToolButton>
      <ToolButton
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        label="인용"
      >
        인용
      </ToolButton>
      <Divider />
      <ToolButton active={editor.isActive('link')} onClick={setLink} label="링크">
        🔗 링크
      </ToolButton>
      <ToolButton onClick={insertImageByUrl} label="이미지 URL">
        🖼️ URL
      </ToolButton>
      <ToolButton onClick={pickFile} label="이미지 업로드" disabled={uploading}>
        {uploading ? '업로드 중…' : '📎 업로드'}
      </ToolButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
      <Divider />
      <ToolButton onClick={insertTable} active={inTable} label="표 삽입">
        ▦ 표
      </ToolButton>
      {inTable && (
        <>
          <ToolButton
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            label="열 추가"
          >
            열＋
          </ToolButton>
          <ToolButton
            onClick={() => editor.chain().focus().deleteColumn().run()}
            label="열 삭제"
          >
            열－
          </ToolButton>
          <ToolButton
            onClick={() => editor.chain().focus().addRowAfter().run()}
            label="행 추가"
          >
            행＋
          </ToolButton>
          <ToolButton
            onClick={() => editor.chain().focus().deleteRow().run()}
            label="행 삭제"
          >
            행－
          </ToolButton>
          <ToolButton
            onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            label="머리글 행"
          >
            머리글
          </ToolButton>
          <ToolButton
            onClick={() => editor.chain().focus().mergeOrSplit().run()}
            label="셀 병합/분할"
          >
            병합
          </ToolButton>
          <ToolButton
            onClick={() => editor.chain().focus().deleteTable().run()}
            label="표 삭제"
          >
            표 삭제
          </ToolButton>
        </>
      )}
      <Divider />
      <ToolButton
        onClick={() => editor.chain().focus().undo().run()}
        label="실행 취소"
        disabled={!editor.can().undo()}
      >
        ↶
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().redo().run()}
        label="다시 실행"
        disabled={!editor.can().redo()}
      >
        ↷
      </ToolButton>
    </div>
  );
}

interface ToolButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}

function ToolButton({ onClick, active, disabled, label, children }: ToolButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`inline-flex h-8 min-w-[34px] items-center justify-center rounded-md px-2 text-xs font-semibold transition-colors ${
        active ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-ink-100'
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function Divider(): JSX.Element {
  return <span className="mx-1 inline-block h-5 w-px bg-ink-100" />;
}
