import { SlugValidationContext } from 'sanity'

export function isUniqueByLanguage(slug: string, context: SlugValidationContext) {
  const { document, getClient } = context
  const client = getClient({ apiVersion: '2024-01-01' })
  const id = document._id.replace(/^drafts\./, '')
  const lang = (document as { language?: string }).language

  if (!lang) {
    return client.fetch(
      `!defined(*[_type == $type && !(_id in [$id, $draftId]) && slug.current == $slug][0]._id)`,
      { type: document._type, id, draftId: `drafts.${id}`, slug }
    )
  }

  return client.fetch(
    `!defined(*[_type == $type && !(_id in [$id, $draftId]) && slug.current == $slug && language == $lang][0]._id)`,
    { type: document._type, id, draftId: `drafts.${id}`, slug, lang }
  )
}
