import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { MetaDescriptionField, MetaImageField, MetaTitleField, OverviewField, PreviewField } from '@payloadcms/plugin-seo/fields'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { PAGE_BLOCKS } from '../../blocks/site/config'
import { PAGE_TEMPLATES } from '../../blocks/site/templates'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'

const applyTemplate: CollectionBeforeChangeHook = ({ data }) => {
  const t = data.template && PAGE_TEMPLATES[data.template as string]
  if (t && (!data.layout || data.layout.length === 0)) {
    data.layout = t.layout()
    if (t.chrome && (!data.chrome || data.chrome === 'default')) data.chrome = t.chrome
  }
  return data
}

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: { create: authenticated, delete: authenticated, read: authenticatedOrPublished, update: authenticated },
  defaultPopulate: { title: true, slug: true },
  admin: {
    group: 'Website',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description: 'Your own pages: About, landing pages, area guides, splash pages. Pick a template to start, then add, remove and reorder blocks.',
    livePreview: { url: ({ data, req }) => generatePreviewPath({ slug: data?.slug, collection: 'pages', req }) },
    preview: (data, { req }) => generatePreviewPath({ slug: data?.slug as string, collection: 'pages', req }),
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'template',
              label: 'Start from a template',
              type: 'select',
              options: Object.entries(PAGE_TEMPLATES).map(([value, t]) => ({ value, label: t.label })),
              admin: { description: 'Fills an empty page with ready-made blocks when you save. Edit everything afterwards.', condition: (d) => !d?.layout?.length },
            },
            { name: 'layout', type: 'blocks', blocks: PAGE_BLOCKS, localized: true, admin: { initCollapsed: true } },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          localized: true,
          fields: [
            OverviewField({ titlePath: 'meta.title', descriptionPath: 'meta.description', imagePath: 'meta.image' }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({ hasGenerateFn: true, titlePath: 'meta.title', descriptionPath: 'meta.description' }),
          ],
        },
      ],
    },
    {
      name: 'chrome',
      label: 'Page style',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Normal', value: 'default' },
        { label: 'Header over the first image', value: 'transparent' },
        { label: 'No header or footer (splash / landing)', value: 'none' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    slugField(),
  ],
  hooks: { beforeChange: [applyTemplate, populatePublishedAt] },
  versions: { drafts: { autosave: { interval: 400 }, schedulePublish: true }, maxPerDoc: 30 },
}
