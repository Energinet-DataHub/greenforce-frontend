import { SvelteKitAuth } from '@auth/sveltekit';
import AzureADB2C from '@auth/core/providers/azure-ad-b2c';
import { env } from '$env/dynamic/private';
import type { Provider } from '@auth/core/providers';

export const handle = SvelteKitAuth({
  debug: true,
  providers: [
    AzureADB2C({
      tenantId: '4a7411ea-ac71-4b63-9647-b8bd4c5a20e0',
      clientId: 'd91c10bb-1441-4ae5-9bf9-e6845567d018',
      clientSecret: 'k_58Q~LmGFODpq2PRubGk_nk5EjwZT7-OrMrbalx',
      primaryUserFlow: 'B2C_1_u001_signin',
      wellKnown:
        'https://devdatahubb2c.b2clogin.com/4a7411ea-ac71-4b63-9647-b8bd4c5a20e0/B2C_1_u001_signin/v2.0/.well-known/openid-configuration',
      authorization: { params: { scope: 'offline_access openid' } },
      checks: ['pkce', 'state'],
      client: { token_endpoint_auth_method: 'none' }
    }) as Provider
  ]
});
