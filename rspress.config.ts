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
  // Set the default theme mode to dark
  markdown: {
    checkDeadLinks: true,
  },
  builderConfig: {
    
    html: {
      tags: [
        {
          tag: 'script',
          // Specify the default theme mode, which can be `dark` or `light`
          children: "window.RSPRESS_THEME = 'dark';",
        },
      ],
    },
  },
  themeConfig: {
    darkMode: false, // allow only dark mode
  },
  route: {
    cleanUrls: true,
  },
  
});
