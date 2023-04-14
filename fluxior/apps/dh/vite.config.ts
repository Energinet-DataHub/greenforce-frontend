import { sveltekit } from '@sveltejs/kit/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import houdini from 'houdini/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [basicSsl(), houdini(), sveltekit()]
});
