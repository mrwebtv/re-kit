import type { Block, Field } from 'payload'
import { ICON_OPTIONS } from '../../site/icons'

const link = (name = 'button'): Field => ({
  name,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text', admin: { description: 'e.g. /valuation' } },
      ],
    },
  ],
})

const heading: Field[] = [
  { name: 'eyebrow', type: 'text' },
  { name: 'heading', type: 'text' },
]

const tone: Field = {
  name: 'background',
  type: 'select',
  defaultValue: 'default',
  options: [
    { label: 'Page', value: 'default' },
    { label: 'Soft', value: 'soft' },
    { label: 'Dark', value: 'dark' },
  ],
}

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'PbHero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'image',
      options: [
        { label: 'Full image', value: 'image' },
        { label: 'Full screen (splash)', value: 'fullscreen' },
        { label: 'Image beside text', value: 'split' },
        { label: 'Text only', value: 'minimal' },
        { label: 'Video background', value: 'video' },
      ],
    },
    ...heading,
    { name: 'text', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'videoUrl', type: 'text', admin: { condition: (_, s) => s?.style === 'video', description: 'Link to an .mp4 file (upload it to Media and paste its URL)' } },
    { name: 'showSearch', type: 'checkbox', admin: { description: 'Property search bar under the heading' } },
    link('button'),
    link('secondaryButton'),
  ],
}

export const TextBlock: Block = {
  slug: 'text',
  interfaceName: 'PbText',
  labels: { singular: 'Text', plural: 'Text' },
  fields: [
    ...heading,
    { name: 'body', type: 'richText' },
    { name: 'width', type: 'select', defaultValue: 'narrow', options: [{ label: 'Narrow (reading)', value: 'narrow' }, { label: 'Wide', value: 'wide' }] },
    tone,
  ],
}

export const ImageTextBlock: Block = {
  slug: 'imageText',
  interfaceName: 'PbImageText',
  labels: { singular: 'Image and text', plural: 'Image and text' },
  fields: [
    ...heading,
    { name: 'body', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imageSide', type: 'select', defaultValue: 'left', options: [{ label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }] },
    link('button'),
    tone,
  ],
}

export const PropertyGridBlock: Block = {
  slug: 'propertyGrid',
  interfaceName: 'PbPropertyGrid',
  labels: { singular: 'Properties', plural: 'Properties' },
  fields: [
    ...heading,
    {
      name: 'show',
      type: 'select',
      defaultValue: 'featured',
      options: [
        { label: 'Featured', value: 'featured' },
        { label: 'Latest for sale', value: 'sale' },
        { label: 'Latest to rent', value: 'rent' },
        { label: 'In a town or area', value: 'town' },
        { label: 'With a label', value: 'label' },
        { label: 'Units in a development', value: 'development' },
        { label: 'Pick by hand', value: 'manual' },
      ],
    },
    { name: 'town', type: 'text', admin: { condition: (_, s) => s?.show === 'town' } },
    { name: 'label', type: 'relationship', relationTo: 'property-labels', admin: { condition: (_, s) => s?.show === 'label' } },
    { name: 'development', type: 'relationship', relationTo: 'properties', admin: { condition: (_, s) => s?.show === 'development' } },
    { name: 'properties', type: 'relationship', relationTo: 'properties', hasMany: true, admin: { condition: (_, s) => s?.show === 'manual' } },
    { name: 'limit', type: 'number', defaultValue: 6, min: 1, max: 24 },
    link('button'),
    tone,
  ],
}

export const SearchBlock: Block = {
  slug: 'searchBar',
  interfaceName: 'PbSearch',
  labels: { singular: 'Search bar', plural: 'Search bars' },
  fields: [...heading, { name: 'mode', type: 'select', defaultValue: 'buy', options: [{ label: 'Buy', value: 'buy' }, { label: 'Rent', value: 'rent' }] }, tone],
}

export const AgentsBlock: Block = {
  slug: 'agentsGrid',
  interfaceName: 'PbAgents',
  labels: { singular: 'Agents', plural: 'Agents' },
  fields: [...heading, { name: 'agents', type: 'relationship', relationTo: 'agents', hasMany: true, admin: { description: 'Blank = all agents' } }, tone],
}

export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'PbStats',
  labels: { singular: 'Numbers', plural: 'Numbers' },
  fields: [
    ...heading,
    { name: 'items', type: 'array', fields: [{ type: 'row', fields: [{ name: 'value', type: 'text', required: true }, { name: 'label', type: 'text', required: true }] }] },
    tone,
  ],
}

export const IconGridBlock: Block = {
  slug: 'iconGrid',
  interfaceName: 'PbIconGrid',
  labels: { singular: 'Features with icons', plural: 'Features with icons' },
  fields: [
    ...heading,
    {
      name: 'items',
      type: 'array',
      fields: [
        { type: 'row', fields: [{ name: 'icon', type: 'select', options: ICON_OPTIONS, defaultValue: 'check' }, { name: 'title', type: 'text', required: true }] },
        { name: 'text', type: 'textarea' },
      ],
    },
    tone,
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'PbTestimonials',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    ...heading,
    {
      name: 'items',
      type: 'array',
      admin: { description: 'Only real client words, with their permission.' },
      fields: [{ name: 'quote', type: 'textarea', required: true }, { type: 'row', fields: [{ name: 'name', type: 'text', required: true }, { name: 'detail', type: 'text', admin: { description: 'e.g. Sold in Ranelagh, 2026' } }] }],
    },
    tone,
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'PbFaq',
  labels: { singular: 'Questions and answers', plural: 'Questions and answers' },
  fields: [...heading, { name: 'items', type: 'array', fields: [{ name: 'question', type: 'text', required: true }, { name: 'answer', type: 'textarea', required: true }] }, tone],
}

export const CtaBlock: Block = {
  slug: 'ctaBanner',
  interfaceName: 'PbCta',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [...heading, { name: 'text', type: 'textarea' }, { name: 'image', type: 'upload', relationTo: 'media' }, link('button'), link('secondaryButton')],
}

export const LeadFormBlock: Block = {
  slug: 'leadForm',
  interfaceName: 'PbLeadForm',
  labels: { singular: 'Form', plural: 'Forms' },
  fields: [
    ...heading,
    { name: 'text', type: 'textarea' },
    { name: 'form', type: 'select', defaultValue: 'contact', options: [{ label: 'Contact', value: 'contact' }, { label: 'Valuation request', value: 'valuation' }, { label: 'Email signup (new listings)', value: 'alert' }] },
    { name: 'buttonLabel', type: 'text' },
    tone,
  ],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'PbGallery',
  labels: { singular: 'Gallery', plural: 'Galleries' },
  fields: [...heading, { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, required: true }],
}

export const VideoBlock: Block = {
  slug: 'video',
  interfaceName: 'PbVideo',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [...heading, { name: 'url', type: 'text', required: true, admin: { description: 'YouTube, Vimeo, Matterport or Kuula link' } }],
}

export const PostsBlock: Block = {
  slug: 'latestPosts',
  interfaceName: 'PbPosts',
  labels: { singular: 'Latest articles', plural: 'Latest articles' },
  fields: [...heading, { name: 'category', type: 'relationship', relationTo: 'categories' }, { name: 'limit', type: 'number', defaultValue: 3 }, tone],
}

export const PAGE_BLOCKS = [HeroBlock, TextBlock, ImageTextBlock, PropertyGridBlock, SearchBlock, AgentsBlock, StatsBlock, IconGridBlock, TestimonialsBlock, FaqBlock, CtaBlock, LeadFormBlock, GalleryBlock, VideoBlock, PostsBlock]
