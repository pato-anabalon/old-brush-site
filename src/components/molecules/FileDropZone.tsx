'use client'

import { Paperclip, X } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'
import { cn } from '@/lib/cn'
import { quoteFlow } from '@/lib/content'
import { ACCEPT_ATTRIBUTE, formatBytes } from '@/lib/quote'

type Props = {
  files: File[]
  error?: string
  onChange: (files: File[]) => void
}

/**
 * Optional attachments step. Files are held in memory only — Vercel Blob
 * is not provisioned yet, so nothing is uploaded and the result screen
 * says so rather than implying the photos were sent.
 */
export function FileDropZone({ files, error, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function addFiles(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return
    const next = [...files]
    for (const file of Array.from(incoming)) {
      if (!next.some((f) => f.name === file.name && f.size === file.size)) next.push(file)
    }
    onChange(next)
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }

  const total = files.reduce((sum, f) => sum + f.size, 0)

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center gap-2 rounded-[var(--radius-sm)] border border-dashed px-6 py-8 text-center transition-colors duration-[var(--duration-fast)]',
          dragging ? 'border-[var(--color-ob-gold)]' : 'border-[var(--color-ob-line)]',
        )}
      >
        <Paperclip aria-hidden="true" size={18} className="text-[var(--color-ob-sand)]" />
        <p className="text-[0.95rem] text-[var(--color-ob-ink-soft)]">
          <span className="hidden sm:inline">{quoteFlow.steps.attachments.dropLabel} </span>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-[var(--color-ob-gold)] underline underline-offset-4"
            data-testid="quote-field-attachments"
          >
            {quoteFlow.steps.attachments.browse}
          </button>
        </p>
        <p className="text-[0.78rem] text-[var(--color-ob-ink-soft)]">
          {quoteFlow.steps.attachments.accepted}
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTRIBUTE}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {files.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {files.map((file) => (
            <li
              key={`${file.name}-${file.size}`}
              className="flex items-center gap-3 rounded-[var(--radius-sm)] border px-3 py-2 text-[0.9rem]"
              style={{ borderColor: 'var(--color-ob-line)' }}
            >
              <span className="flex-1 truncate">{file.name}</span>
              <span className="flex-none text-[0.78rem] text-[var(--color-ob-ink-soft)]">
                {formatBytes(file.size)}
              </span>
              <button
                type="button"
                onClick={() => onChange(files.filter((f) => f !== file))}
                aria-label={quoteFlow.steps.attachments.remove.replace('{name}', file.name)}
                className="flex h-8 w-8 flex-none items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-ob-ink-soft)] transition-colors hover:text-[var(--color-ob-gold)]"
              >
                <X aria-hidden="true" size={15} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {files.length > 0 ? (
        <p className="text-[0.78rem] text-[var(--color-ob-ink-soft)]">
          {quoteFlow.steps.attachments.totalLabel
            .replace('{count}', String(files.length))
            .replace('{size}', formatBytes(total))}
        </p>
      ) : null}

      {error ? (
        <p className="ob-field-error" data-testid="quote-error-attachments">
          {error}
        </p>
      ) : null}
    </div>
  )
}
