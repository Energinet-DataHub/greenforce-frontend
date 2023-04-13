import { HoudiniClient } from 'houdini';

export default new HoudiniClient({
  url: 'https://localhost:5001/graphql',
  fetchParams({ session }) {
    return {
      headers: {
        Authorization: `Bearer ${session?.token}`
      }
    };
  }
});
