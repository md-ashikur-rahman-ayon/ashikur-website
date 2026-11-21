import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://ashikur.safeshare.co',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'always' },
  adapter: vercel(),
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap({
      filter: (page) => !page.includes('/keystatic') && !page.includes('/404'),
      // tell Google which photos of Ashik live on which page, so they can show up in image search for his name
      serialize(item) {
        const S = 'https://ashikur.safeshare.co/img/';
        const IMGS = {
          'https://ashikur.safeshare.co/': [
            ['portrait-halftone.png', 'Md Ashikur Rahman (Ashik Ayon), Rajshahi, Bangladesh'],
            ['bench3-1100.webp', 'Ashikur Rahman (Ashik) on a waiting-room bench'],
            ['buran-1200.webp', 'Ashikur Rahman in front of the Buran space shuttle, Sirius, Russia'],
            ['flag-1000.webp', 'Ashikur Rahman with the flag of Bangladesh at the climate conference in Sirius'],
            ['hat-1000.webp', 'Ashikur Rahman in Hoi An, Vietnam'],
            ['darj1-1200.webp', 'Ashikur Rahman in Darjeeling, India'],
          ],
          'https://ashikur.safeshare.co/about/': [
            ['hat-1000.webp', 'Ashikur Rahman (Ashik) in Hoi An, Vietnam'],
            ['tree-1400.webp', 'Ashikur Rahman and the Bangladesh team planting a tree in Sirius, Russia'],
          ],
        };
        const list = IMGS[item.url];
        if (list) item.img = list.map(([f, caption]) => ({ url: S + f, caption, title: caption }));
        if (item.url === 'https://ashikur.safeshare.co/') item.priority = 1.0;
        else if (item.url.endsWith('/about/')) item.priority = 0.9;
        return item;
      },
    }),
  ],
});
