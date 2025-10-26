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
      { text: 'docs', link: '/docs/' },
      { text: 'pricing', link: '/pricing/' },
    ],
  },
  route: {
    cleanUrls: true,
  },
});
