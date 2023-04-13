/** @type {import('houdini').ConfigFile} */
const config = {
   logLevel: 'full',
   watchSchema: {
        url: 'https://localhost:5001/graphql',
    },
  "plugins": {
    "houdini-svelte": {}
  }
}

export default config
