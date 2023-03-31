import { SvelteKitAuth } from '@auth/sveltekit';
import AzureADB2C from '@auth/core/providers/azure-ad-b2c';
import { env } from '$env/dynamic/private';
import type { Provider } from '@auth/core/providers';

export const handle = SvelteKitAuth({
  debug: true,
  secret: env.secret,
  providers: [
    AzureADB2C({
      //issuer: 'https://fluxiororg.b2clogin.com/fluxiororg.onmicrosoft.com/v2.0',
      tenantId: 'fluxiororg',
      clientId: '2047be93-878e-4360-9b43-ca6e7beb9b5b',
      clientSecret: 'mJK8Q~GcXlnw861P7PbEbApud8k~MaaywYENpcR~',
      primaryUserFlow: 'B2C_1A_SIGNUP_SIGNIN'
      // wellKnown: 'https://devdatahubb2c.b2clogin.com/4a7411ea-ac71-4b63-9647-b8bd4c5a20e0/B2C_1_u001_signin/v2.0/.well-known/openid-configuration',
      // authorization: {
      //   params: { scope: 'openid profile offline_access' }
      // }
      // checks: ['pkce', 'state'],
      // client: { token_endpoint_auth_method: 'none' }
    }) as Provider
  ]
});
