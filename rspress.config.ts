import * as path from 'node:path';
import { defineConfig } from 'rspress/config';
import { pluginShiki } from "@rspress/plugin-shiki";
import { pluginClientRedirects } from '@rspress/plugin-client-redirects';


export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Floww',
  icon: '/floww-dark-logo.png',
  globalStyles: path.join(__dirname, 'styles/index.css'),
  logo: {
    light: '/floww-light-logo.png',
    dark: '/floww-dark-logo.png',
  },
  // Set the default theme mode to dark
  markdown: {
    checkDeadLinks: true,
  },
  plugins: [
    pluginClientRedirects({
      redirects: [
        {
          from: '^/index$',
          to: '/docs/quick-start',
        },
        {
          from: '^/$',
          to: '/docs/quick-start',
        },
        {
          from: '^/docs/$',
          to: '/docs/quick-start',
        },
      ],
    }),  
    pluginShiki({
      langs: [
        "js",
        "jsx",
        "ts",
        "tsx",
        "json",
        "css",
        "scss",
        "less",
        "xml",
        "diff",
        "yaml",
        "md",
        "mdx",
        "bash",
        // Additional
        "fish",
        "py",
        "python",
        "hcl",
        "csv",
        "dockerfile",
      ],
    }),
  ],
  route: {
    cleanUrls: true,
  },
});
