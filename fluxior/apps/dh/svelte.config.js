import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const filePath = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      scss: {
        verbose: false,
        includePaths: [join(filePath, 'node_modules')]
      },
    })
  ],

	kit: {
		adapter: adapter(),
		alias: {
			$houdini: './$houdini',
		}
	}
};

export default config;
