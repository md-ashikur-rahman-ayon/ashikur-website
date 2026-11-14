import { config, fields, collection, singleton } from '@keystatic/core';

// On your own computer the editor saves straight into these files.
// On the live site it saves to GitHub, and Netlify republishes the site a minute later.
const repo = (import.meta.env.PUBLIC_KEYSTATIC_REPO || 'OWNER/ashikur-site') as `${string}/${string}`;

export default config({
  storage: import.meta.env.PROD ? { kind: 'github', repo } : { kind: 'local' },
  ui: {
    brand: { name: 'Ashik’s site' },
    navigation: { Writing: ['notebook'], Reading: ['shelf'] },
  },
  collections: {
    notebook: collection({
      label: 'Notebook pieces',
      slugField: 'title',
      path: 'src/content/notebook/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' }, slug: { label: 'Web address', description: 'The end of the link, made from the title. Leave it as it is unless the title is very long.' } }),
        shortTitle: fields.text({ label: 'Short title', description: 'Shown on the homepage notebook sheet, e.g. "On Animal Farm".' }),
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        tags: fields.array(fields.text({ label: 'Topic' }), { label: 'Topics', itemLabel: (p) => p.value, description: 'Power, Philosophy, Politics and so on. Readers can filter by these.' }),
        excerpt: fields.text({ label: 'Opening lines', multiline: true, description: 'Two or three sentences shown on the notebook page.' }),
        summary: fields.text({ label: 'One-line summary', description: 'Shown in the list of all pages.' }),
        readingTime: fields.integer({ label: 'Minutes to read', defaultValue: 4 }),
        mediumUrl: fields.url({ label: 'Link on Medium (optional)' }),
        drawing: fields.select({ label: 'Drawing', options: [{ label: 'Windmill', value: 'windmill' }, { label: 'None', value: 'none' }], defaultValue: 'none' }),
        caption: fields.text({ label: 'Caption under the drawing (optional)' }),
        content: fields.markdoc({ label: 'The piece', description: 'A line on its own with --- makes the small ornament. A quote block becomes the large pull quote.' }),
      },
    }),
  },
  singletons: {
    shelf: singleton({
      label: 'The shelf',
      path: 'src/content/shelf',
      format: { data: 'json' },
      schema: {
        readingNow: fields.object({
          title: fields.text({ label: 'Book' }),
          author: fields.text({ label: 'Author' }),
        }, { label: 'Reading now' }),
        english: fields.array(fields.object({
          title: fields.text({ label: 'Title' }),
          author: fields.text({ label: 'Author' }),
        }), { label: 'Books in English', itemLabel: (p) => p.fields.title.value }),
        bangla: fields.array(fields.object({
          author: fields.text({ label: 'Author (English)' }),
          authorBn: fields.text({ label: 'Author (Bangla)' }),
          note: fields.text({ label: 'Note', description: 'Shown after the count, e.g. "books, mostly science fiction".' }),
          books: fields.array(fields.text({ label: 'Title' }), { label: 'Books', itemLabel: (p) => p.value }),
        }), { label: 'Books in Bangla, by author', itemLabel: (p) => p.fields.author.value }),
      },
    }),
  },
});
