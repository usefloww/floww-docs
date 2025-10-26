import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Floww',
  icon: '/rspress-icon.png',
  globalStyles: path.join(__dirname, 'styles/index.css'),
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  themeConfig: {
    nav: [
      { text: 'Docs', link: '/docs/' },
      { text: 'Reference', link: '/reference/' },
      { text: 'Pricing', link: '/pricing/' },
    ],
  },
  route: {
    cleanUrls: true,
  },
});
