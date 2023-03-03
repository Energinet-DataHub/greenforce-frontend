import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const filePath = dirname(fileURLToPath(import.meta.url));
const sassPath = `${filePath}/src/scss`;

const nodeModulesPath = join(filePath, 'node_modules');

console.log('nodeModulesPath', nodeModulesPath);

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
    adapter: adapter()
  }
};

export default config;
