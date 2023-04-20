import { HoudiniClient } from '$houdini';

export default new HoudiniClient({
  url: 'https://localhost:5001/graphql',

  // uncomment this to configure the network call (for things like authentication)
  // for more information, please visit here: https://www.houdinigraphql.com/guides/authentication
  fetchParams({ session }) {
    return {
      headers: {
        Authorization: `Bearer ${session?.token.accessToken}`
      }
    };
  }
});
