import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { cn } from '@/shared/utils/utils'

export interface TokenEditorRef {
  insertToken: (token: string) => void
  focus: () => void
}

interface TokenEditorFieldProps {
  value: string
  onChange: (val: string) => void
  tokens: string[]
  dir?: 'rtl' | 'ltr'
  multiline?: boolean
  placeholder?: string
  className?: string
  maxLength?: number
  onFocus?: () => void
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function textToHtml(text: string): string {
  if (!text) return ''
  // Escape HTML first
  let html = escapeHtml(text)

  // Replace tokens like {user_name} with non-editable badge spans
  html = html.replace(/\{[a-zA-Z0-9_-]+\}/g, (token) => {
    return `<span contenteditable="false" data-token="${token}" class="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-main/15 text-main font-mono text-[11px] font-bold border border-main/30 select-all cursor-default">${token}</span>`
  })

  // Replace newlines with <br>
  html = html.replace(/\r\n|\r|\n/g, '<br>')
  return html
}

function htmlToText(html: string): string {
  if (!html) return ''
  // Create a temporary element to parse safely
  const temp = document.createElement('div')
  temp.innerHTML = html

  // Replace token spans with their data-token
  const tokenSpans = temp.querySelectorAll('span[data-token]')
  tokenSpans.forEach((span) => {
    const token = span.getAttribute('data-token') || span.textContent || ''
    span.replaceWith(document.createTextNode(token))
  })

  // Convert <br> and <div> to newlines
  const brs = temp.querySelectorAll('br')
  brs.forEach((br) => br.replaceWith('\n'))

  const divs = temp.querySelectorAll('div, p')
  divs.forEach((div) => {
    div.prepend(document.createTextNode('\n'))
  })

  return temp.textContent || ''
}

export const TokenEditorField = forwardRef<TokenEditorRef, TokenEditorFieldProps>(
  (
    {
      value,
      onChange,
      dir = 'ltr',
      multiline = true,
      placeholder = '',
      className,
      maxLength = 2000,
      onFocus,
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const isInternalUpdate = useRef(false)
    const lastSelectionRange = useRef<Range | null>(null)

    // Sync external value with editor content
    useEffect(() => {
      const editor = editorRef.current
      if (!editor) return

      if (isInternalUpdate.current) {
        isInternalUpdate.current = false
        return
      }

      const currentText = htmlToText(editor.innerHTML)
      if (currentText !== value) {
        editor.innerHTML = textToHtml(value)
      }
    }, [value])

    // Save selection range when user interacts
    const saveSelection = () => {
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        // Ensure range is inside this editor
        if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
          lastSelectionRange.current = range.cloneRange()
        }
      }
    }

    useImperativeHandle(ref, () => ({
      focus: () => {
        editorRef.current?.focus()
      },
      insertToken: (token: string) => {
        const editor = editorRef.current
        if (!editor) return

        editor.focus()
        const sel = window.getSelection()

        // Create the token node
        const tokenSpan = document.createElement('span')
        tokenSpan.contentEditable = 'false'
        tokenSpan.setAttribute('data-token', token)
        tokenSpan.className =
          'inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-main/15 text-main font-mono text-[11px] font-bold border border-main/30 select-all cursor-default'
        tokenSpan.textContent = token

        // Add a non-breaking or zero-width space after so typing can continue
        const spaceNode = document.createTextNode('\u00A0')

        let range = lastSelectionRange.current
        if (range && editor.contains(range.commonAncestorContainer)) {
          range.deleteContents()
          range.insertNode(spaceNode)
          range.insertNode(tokenSpan)
          range.setStartAfter(spaceNode)
          range.setEndAfter(spaceNode)
          if (sel) {
            sel.removeAllRanges()
            sel.addRange(range)
          }
        } else {
          // Append at end
          editor.appendChild(tokenSpan)
          editor.appendChild(spaceNode)
          if (sel) {
            range = document.createRange()
            range.setStartAfter(spaceNode)
            range.setEndAfter(spaceNode)
            sel.removeAllRanges()
            sel.addRange(range)
          }
        }

        saveSelection()
        const newText = htmlToText(editor.innerHTML)
        isInternalUpdate.current = true
        onChange(newText)
      },
    }))

    const handleInput = () => {
      const editor = editorRef.current
      if (!editor) return

      let text = htmlToText(editor.innerHTML)
      if (maxLength && text.length > maxLength) {
        text = text.substring(0, maxLength)
        editor.innerHTML = textToHtml(text)
      }

      isInternalUpdate.current = true
      onChange(text)
      saveSelection()
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault()
      const text = e.clipboardData.getData('text/plain')
      if (!text) return

      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        range.deleteContents()

        // Insert as converted HTML with tokens
        const temp = document.createElement('div')
        temp.innerHTML = textToHtml(text)

        const fragment = document.createDocumentFragment()
        while (temp.firstChild) {
          fragment.appendChild(temp.firstChild)
        }

        range.insertNode(fragment)
        range.collapse(false)
        sel.removeAllRanges()
        sel.addRange(range)

        handleInput()
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!multiline && e.key === 'Enter') {
        e.preventDefault()
        return
      }
    }

    return (
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          dir={dir}
          onInput={handleInput}
          onFocus={() => {
            saveSelection()
            onFocus?.()
          }}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          data-placeholder={placeholder}
          className={cn(
            'w-full rounded-xl border border-border/60 bg-card p-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-main/20 focus:border-main transition-all whitespace-pre-wrap break-words empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/60 empty:before:pointer-events-none',
            multiline ? 'min-h-[96px] max-h-[220px] overflow-y-auto' : 'min-h-[40px] h-10 overflow-hidden flex items-center',
            className
          )}
        />
      </div>
    )
  }
)

TokenEditorField.displayName = 'TokenEditorField'
