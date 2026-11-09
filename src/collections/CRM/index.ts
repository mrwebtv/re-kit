import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrOwnAgent, agentIdOf, isAgentUser, loggedIn } from '../../access/roles'

export const STAGES = [
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Viewing', value: 'viewing' },
  { label: 'Offer', value: 'offer' },
  { label: 'Agreed', value: 'agreed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Lost', value: 'lost' },
]

export const Deals: CollectionConfig = {
  slug: 'deals',
  admin: {
    useAsTitle: 'title',
    group: 'CRM',
    defaultColumns: ['title', 'stage', 'value', 'property', 'agent', 'updatedAt'],
    description: 'Every lead becomes a deal. Drag them through the stages on the Pipeline board.',
    components: { beforeList: ['@/components/admin/PipelineLink#PipelineLink'] },
  },
  access: { read: adminOrOwnAgent('agent'), create: loggedIn, update: adminOrOwnAgent('agent'), delete: adminOnly },
  defaultSort: '-updatedAt',
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create' && isAgentUser(req.user as never) && !data.agent) data.agent = agentIdOf(req.user as never)
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'stage', type: 'select', required: true, defaultValue: 'new', index: true, options: STAGES },
        { name: 'value', type: 'number', min: 0, admin: { description: 'Expected price or rent' } },
        { name: 'expectedClose', type: 'date' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'contactName', type: 'text', required: true },
        { name: 'contactEmail', type: 'email' },
        { name: 'contactPhone', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'property', type: 'relationship', relationTo: 'properties' },
        { name: 'agent', type: 'relationship', relationTo: 'agents' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          defaultValue: 'manual',
          options: [
            { label: 'Added here', value: 'manual' },
            { label: 'Property enquiry', value: 'property' },
            { label: 'Viewing request', value: 'viewing' },
            { label: 'Valuation request', value: 'valuation' },
            { label: 'Contact form', value: 'contact' },
          ],
        },
        { name: 'lead', type: 'relationship', relationTo: ['enquiries', 'viewings'], admin: { readOnly: true } },
      ],
    },
    { name: 'lostReason', type: 'text', admin: { condition: (d) => d?.stage === 'lost' } },
    { name: 'notes', type: 'textarea' },
    { name: 'activities', type: 'join', collection: 'activities', on: 'deal', defaultSort: '-createdAt', admin: { defaultColumns: ['type', 'summary', 'dueAt', 'done'] } },
  ],
}

export const Activities: CollectionConfig = {
  slug: 'activities',
  admin: { useAsTitle: 'summary', group: 'CRM', defaultColumns: ['type', 'summary', 'deal', 'dueAt', 'done', 'createdBy'], description: 'Calls, emails, meetings, notes and tasks against a deal.' },
  access: { read: adminOrOwnAgent('deal.agent'), create: loggedIn, update: adminOrOwnAgent('deal.agent'), delete: adminOrOwnAgent('deal.agent') },
  defaultSort: '-createdAt',
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create' && req.user) data.createdBy = req.user.id
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'note',
          options: ['note', 'call', 'email', 'meeting', 'viewing', 'task'].map((v) => ({ label: v[0]!.toUpperCase() + v.slice(1), value: v })),
        },
        { name: 'deal', type: 'relationship', relationTo: 'deals', required: true, index: true },
      ],
    },
    { name: 'summary', type: 'text', required: true },
    { name: 'details', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'dueAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' }, description: 'For tasks and meetings' } },
        { name: 'done', type: 'checkbox' },
      ],
    },
    { name: 'createdBy', type: 'relationship', relationTo: 'users', admin: { readOnly: true, position: 'sidebar' } },
  ],
}

/** Daily visit counts per page and property, written by /api/track. No cookies, no IP addresses stored. */
export const PageStats: CollectionConfig = {
  slug: 'page-stats',
  admin: { hidden: true },
  access: { read: adminOrOwnAgent('agent'), create: () => false, update: () => false, delete: adminOnly },
  fields: [
    { name: 'day', type: 'text', required: true, index: true },
    { name: 'path', type: 'text', required: true, index: true },
    { name: 'property', type: 'relationship', relationTo: 'properties', index: true },
    { name: 'agent', type: 'relationship', relationTo: 'agents', index: true },
    { name: 'views', type: 'number', defaultValue: 0 },
    { name: 'visitors', type: 'number', defaultValue: 0 },
    { name: 'devices', type: 'json' },
    { name: 'referrers', type: 'json' },
  ],
}
