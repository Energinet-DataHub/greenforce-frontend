import adapter from '@sveltejs/adapter-auto';
import path from 'path'
import preprocess from 'svelte-preprocess';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const filePath = dirname(fileURLToPath(import.meta.url));
const sassPath = `${filePath}/src/scss`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      scss: {
        prependData: `@import '${sassPath}/globals.scss';`,
        includePaths: [join(filePath, 'node_modules')]
      },
    })
  ],

  kit: {
    alias: {
      $houdini: path.resolve('.', '$houdini')
  },
    adapter: adapter()
  }
};

export default config;
