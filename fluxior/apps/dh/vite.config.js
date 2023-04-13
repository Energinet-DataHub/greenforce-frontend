import { sveltekit } from '@sveltejs/kit/vite';
import basicSsl from '@vitejs/plugin-basic-ssl'
import houdini from 'houdini/vite'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [houdini(), sveltekit()],
};

export default config;
