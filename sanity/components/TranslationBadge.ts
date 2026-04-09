import { useEffect, useState } from 'react'
import { useClient, type DocumentBadgeComponent, type DocumentBadgeDescription } from 'sanity'

export const TranslationBadge: DocumentBadgeComponent = function TranslationBadge({ published, draft }) {
  const doc = published ?? draft
  const client = useClient({ apiVersion: '2024-01-01' })
  const [status, setStatus] = useState<'has-es' | 'no-es' | null>(null)

  useEffect(() => {
    if (!doc?._id) return
    const lang = (doc as Record<string, unknown>).language
    if (lang !== 'en') return

    const id = doc._id.replace(/^drafts\./, '')
    client
      .fetch<{ hasEs: boolean } | null>(
        `*[_type == "translation.metadata" && references($id)][0]{
          "hasEs": defined(translations[_key == "es"][0])
        }`,
        { id }
      )
      .then((result) => setStatus(result?.hasEs ? 'has-es' : 'no-es'))
  }, [doc?._id, client])

  const lang = (doc as Record<string, unknown> | null)?.language
  if (!doc || lang !== 'en' || status === null) return null

  return status === 'has-es'
    ? ({ label: 'ES ✓', color: 'success', title: 'Spanish translation exists' } as DocumentBadgeDescription)
    : ({ label: 'ES —', color: 'warning', title: 'No Spanish translation yet' } as DocumentBadgeDescription)
}
