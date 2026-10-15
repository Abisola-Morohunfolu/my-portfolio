import { defineArrayMember, defineField, defineType } from 'sanity';

const screenshot = defineType({
  name: 'screenshot',
  title: 'Screenshot',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the useful content of this real screenshot.',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'caption', type: 'string' }),
  ],
});
const richText = defineType({
  name: 'richText',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' },
        { title: 'Heading', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                validation: (rule) => rule.uri({ scheme: ['https'] }),
              }),
            ],
          }),
        ],
      },
    }),
  ],
});
const section = defineType({
  name: 'projectSection',
  title: 'Case-study section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'richText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'howItWorks',
      title: 'How it works',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'image', type: 'screenshot' }),
  ],
  preview: { select: { title: 'title' } },
});
const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 80 },
      description:
        'Keep published slugs stable. Changing a slug changes the public URL.',
      validation: (rule) =>
        rule.required().custom(async (value, context) => {
          if (!value?.current) return true;
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current))
            return 'Use lowercase words separated by hyphens.';
          const id = context.document?._id.replace(/^drafts\./, '');
          if (!id) return true;
          const published = await context
            .getClient({ apiVersion: '2026-03-01' })
            .withConfig({ perspective: 'published', useCdn: false })
            .fetch<string | null>('*[_id == $id][0].slug.current', { id });
          return published && published !== value.current
            ? 'Keep this published slug stable so existing links continue to work.'
            : true;
        }),
    }),
    defineField({
      name: 'category',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contribution',
      title: 'The work',
      description:
        'Describe what the project helps people do. Keep implementation details in Technologies.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'introduction',
      description:
        'Optional opening paragraphs. The first is the page headline.',
      type: 'array',
      of: [defineArrayMember({ type: 'text' })],
    }),
    defineField({
      name: 'technologies',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          'Live product',
          'Prototype',
          'Work in progress',
          'Personal project',
          'Earlier work',
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'statusNote',
      title: 'Project note',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'order',
      type: 'number',
      initialValue: 10,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'featured',
      title: 'Show in homepage viewer',
      type: 'boolean',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'cover', type: 'screenshot' }),
    defineField({
      name: 'gallery',
      type: 'array',
      of: [defineArrayMember({ type: 'screenshot' })],
    }),
    defineField({
      name: 'sections',
      type: 'array',
      of: [defineArrayMember({ type: 'projectSection' })],
    }),
    defineField({
      name: 'impactEvidence',
      title: 'Supported outcomes',
      type: 'array',
      of: [defineArrayMember({ type: 'text' })],
      description: 'Use qualitative outcomes unless you have measurements.',
    }),
    defineField({
      name: 'collaborators',
      title: 'Team credit',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'demoUrl',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'sourceUrl',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'relatedSlug',
      title: 'Related project slug',
      type: 'string',
    }),
  ],
  orderings: [
    {
      title: 'Portfolio order',
      name: 'portfolioOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: { select: { title: 'title', subtitle: 'status', media: 'cover' } },
});
const profile = defineType({
  name: 'profile',
  title: 'Profile & builder notes',
  type: 'document',
  fields: [
    ...['name', 'role', 'email'].map((name) =>
      defineField({
        name,
        type: 'string',
        validation: (rule) => rule.required(),
      }),
    ),
    defineField({
      name: 'biography',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    ...['github', 'linkedin'].map((name) =>
      defineField({
        name,
        type: 'url',
        validation: (rule) => rule.required().uri({ scheme: ['https'] }),
      }),
    ),
    defineField({
      name: 'notes',
      title: "Builder's notes",
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'builderNote',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'projectSlug', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
});
export const schemaTypes = [screenshot, richText, section, project, profile];
