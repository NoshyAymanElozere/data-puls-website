// @ts-ignore
import { CKEditor } from '@ckeditor/ckeditor5-react'
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const TOOLBAR = ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo']

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  /** Language of the edited content; Arabic content is typed right-to-left. */
  contentLanguage: 'en' | 'ar'
  disabled?: boolean
}

/**
 * CKEditor with an LTR toolbar regardless of the surrounding `dir`.
 * Rendering the editor inside an RTL container while its UI is LTR makes CKEditor's
 * "group when full" measurement think every button overflows, collapsing the toolbar to "⋮".
 * The content direction comes from `language.content` instead.
 */
export function RichTextEditor({ value, onChange, contentLanguage, disabled = false }: RichTextEditorProps) {
  return (
    <div dir="ltr" className="prose dark:prose-invert max-w-none">
      {/* @ts-ignore */}
      <CKEditor
        editor={ClassicEditor}
        config={{ toolbar: TOOLBAR, language: { ui: 'en', content: contentLanguage } }}
        data={value || ''}
        disabled={disabled}
        onChange={(_: unknown, editor: { getData: () => string }) => onChange(editor.getData())}
      />
    </div>
  )
}
