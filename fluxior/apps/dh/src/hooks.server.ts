import { SvelteKitAuth } from '@auth/sveltekit';
import AzureADB2C from '@auth/core/providers/azure-ad-b2c';
import { env } from '$env/dynamic/private';
import type { Provider } from '@auth/core/providers';

export const handle = SvelteKitAuth({
  debug: true,
  secret: env.secret,
  providers: [
    AzureADB2C({
      // issuer: 'https://devdatahubb2c.b2clogin.com/4a7411ea-ac71-4b63-9647-b8bd4c5a20e0/v2.0/',
      tenantId: 'devdatahubb2c',
      clientId: 'd91c10bb-1441-4ae5-9bf9-e6845567d018',
      clientSecret: 'k_58Q~LmGFODpq2PRubGk_nk5EjwZT7-OrMrbalx',
      primaryUserFlow: 'b2c_1_u001_signin',
      // wellKnown: 'https://devdatahubb2c.b2clogin.com/4a7411ea-ac71-4b63-9647-b8bd4c5a20e0/B2C_1_u001_signin/v2.0/.well-known/openid-configuration',
      authorization: {
        params: { scope: 'd91c10bb-1441-4ae5-9bf9-e6845567d018 openid profile offline_access' }
      }
      // checks: ['pkce', 'state'],
      // client: { token_endpoint_auth_method: 'none' }
    }) as Provider
  ]
});
