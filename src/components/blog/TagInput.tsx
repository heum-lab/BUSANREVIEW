'use client';

import { useState, type KeyboardEvent } from 'react';

interface TagInputProps {
  name: string;
  initialTags?: string[];
  max?: number;
  placeholder?: string;
}

export function TagInput({
  name,
  initialTags = [],
  max = 10,
  placeholder = '태그 입력 후 Enter (쉼표 / 스페이스도 가능)',
}: TagInputProps): JSX.Element {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [input, setInput] = useState('');

  const addTag = (raw: string): void => {
    const v = raw.replace(/^#/, '').trim();
    if (!v) return;
    if (tags.includes(v)) return;
    if (tags.length >= max) return;
    setTags([...tags, v]);
    setInput('');
  };

  const removeTag = (tag: string): void => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      if (input.trim()) {
        e.preventDefault();
        addTag(input);
      }
    } else if (e.key === 'Backspace' && !input && tags.length) {
      e.preventDefault();
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="rounded-xl border border-ink-100 bg-white px-3 py-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
      <input type="hidden" name={name} value={JSON.stringify(tags)} />
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-700"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-ink-500 transition-colors hover:text-ink-900"
              aria-label={`${tag} 삭제`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={tags.length === 0 ? placeholder : ''}
          maxLength={20}
          className="flex-1 min-w-[160px] border-0 bg-transparent px-1 py-1 text-sm placeholder:text-ink-300 focus:outline-none"
        />
      </div>
      <p className="mt-2 text-xs text-ink-500">
        최대 {max}개, 한 태그당 20자까지 입력할 수 있습니다.
      </p>
    </div>
  );
}
