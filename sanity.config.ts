import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { assist } from '@sanity/assist'
import { media } from 'sanity-plugin-media'
import { schemaTypes } from './sanity/schemaTypes'
import { TranslationBadge } from './sanity/components/TranslationBadge'

const singletons = ['home', 'about', 'settings', 'programsPage']
const i18nTypes = ['residencyProgram', 'artist', 'journal', 'about', 'home', 'programsPage', 'location']

export default defineConfig({
  name: 'volavan',
  title: 'Volavan',
  basePath: '/studio',
  projectId: '98dco624',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Home')
              .child(S.document().schemaType('home').documentId('home')),
            S.listItem()
              .title('About')
              .child(S.document().schemaType('about').documentId('about')),
            S.listItem()
              .title('Programs Page')
              .child(S.document().schemaType('programsPage').documentId('programsPage')),
            S.divider(),
            S.listItem()
              .title('Artists')
              .schemaType('artist')
              .child(
                S.documentTypeList('artist')
                  .title('Artists')
                  .filter('_type == "artist" && (language == "en" || !defined(language))')
              ),
            S.listItem()
              .title('Programs')
              .schemaType('residencyProgram')
              .child(
                S.documentTypeList('residencyProgram')
                  .title('Programs')
                  .filter('_type == "residencyProgram" && (language == "en" || !defined(language))')
                  .child((programId) =>
                    S.list()
                      .title('Program')
                      .items([
                        S.listItem()
                          .title('Details')
                          .child(
                            S.document()
                              .schemaType('residencyProgram')
                              .documentId(programId)
                          ),
                        S.listItem()
                          .title('Editions')
                          .child(
                            S.documentList()
                              .title('Editions')
                              .filter('_type == "residency" && program._ref == $programId')
                              .params({ programId })
                              .initialValueTemplates([
                                S.initialValueTemplateItem('residency-by-program', { programId }),
                              ])
                          ),
                      ])
                  )
              ),
            S.listItem()
              .title('Journal')
              .schemaType('journal')
              .child(
                S.documentTypeList('journal')
                  .title('Journal')
                  .filter('_type == "journal" && (language == "en" || !defined(language))')
              ),
            S.listItem()
              .title('Locations')
              .schemaType('location')
              .child(
                S.documentTypeList('location')
                  .title('Locations')
                  .filter('_type == "location" && (language == "en" || !defined(language))')
              ),
            S.divider(),
            S.listItem()
              .title('Settings')
              .child(S.document().schemaType('settings').documentId('settings')),
          ]),
    }),
    visionTool(),
    media(),
    internationalizedArray({
      languages: [
        { id: 'en', title: 'English' },
        { id: 'es', title: 'Español' },
      ],
      defaultLanguages: ['en'],
      fieldTypes: ['text'],
    }),
    documentInternationalization({
      supportedLanguages: [
        { id: 'en', title: 'English' },
        { id: 'es', title: 'Español' },
      ],
      schemaTypes: ['residencyProgram', 'artist', 'journal', 'about', 'home', 'programsPage', 'location'],
    }),
    assist({
      translate: {
        document: {
          languageField: 'language',
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => [
      ...templates.filter(({ schemaType, id }) =>
        !singletons.includes(schemaType) && !(i18nTypes.includes(schemaType) && id === schemaType)
      ),
      {
        id: 'residency-by-program',
        title: 'Residency with Program',
        schemaType: 'residency',
        parameters: [{ name: 'programId', type: 'string' }],
        value: ({ programId }: { programId: string }) => ({
          program: { _type: 'reference', _ref: programId },
        }),
      },
    ],
  },
  document: {
    badges: (prev, context) =>
      ['residencyProgram', 'artist', 'journal', 'home', 'about', 'programsPage', 'location'].includes(context.schemaType)
        ? [...prev, TranslationBadge]
        : prev,
    actions: (input, context) =>
      singletons.includes(context.schemaType)
        ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})
