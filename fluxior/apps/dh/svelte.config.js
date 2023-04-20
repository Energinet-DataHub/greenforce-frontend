/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
      }
    })
  ],

  kit: {
    adapter: adapter(),
    alias: {
      $houdini: './$houdini'
    }
  }
};

export default config;
