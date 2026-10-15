import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';
import { CaseStudyPreview } from './components/CaseStudyPreview';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId)
  throw new Error(
    'Set SANITY_STUDIO_PROJECT_ID in studio/.env before starting Studio.',
  );
export default defineConfig({
  name: 'abisola',
  title: "Abisola's working studio",
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Profile & builder notes')
              .child(S.document().schemaType('profile').documentId('profile')),
            S.documentTypeListItem('project').title('Projects'),
          ]),
      defaultDocumentNode: (S, { schemaType }) =>
        schemaType === 'project'
          ? S.document().views([
              S.view.form(),
              S.view.component(CaseStudyPreview).title('Case-study preview'),
            ])
          : S.document().views([S.view.form()]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => template.schemaType !== 'profile'),
  },
  document: {
    actions: (actions, context) =>
      context.schemaType === 'profile'
        ? actions.filter(
            (action) =>
              !['delete', 'duplicate', 'unpublish'].includes(
                action.action ?? '',
              ),
          )
        : actions,
  },
});
