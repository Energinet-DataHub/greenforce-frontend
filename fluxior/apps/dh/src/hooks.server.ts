import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import AzureADB2C from '@auth/core/providers/azure-ad-b2c';
import { env } from '$env/dynamic/private';
import type { Provider } from '@auth/core/providers';
import { setSession } from '$houdini';
import type { Handle } from '@sveltejs/kit';

export const handle = SvelteKitAuth(async (event) => {
  const authOptions: SvelteKitAuthConfig = {
    debug: false,
    trustHost: true,
    secret: env.AUTH_SECRET,
    callbacks: {
      async session({ session, token }) {
        // session.accessToken = token.accessToken;
        setSession(event, token);
        return session;
      },
      async jwt({ token, account }) {
        if (account) {
          console.log(account.access_token);
          try {
            const actorIds = await fetch(
              'https://localhost:5001/v1/MarketParticipantUser/GetUserActors',
              {
                credentials: 'include',
                headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${account.access_token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            console.log(actorIds.statusText);
            const test = await actorIds.text();
            console.log(test);
            // console.log(actorIds, account.access_token);
          } catch (e) {
            console.error(e);
          }

          //token.accessToken = account.access_token;
        }
        return token;
      }
    },
    providers: [
      AzureADB2C({
        issuer: env.AZURE_AD_B2C_TENANT_ISSUER,
        token: env.AZURE_AD_B2C_TOKEN_ENDPOINT,
        userinfo: env.AZURE_AD_B2C_TOKEN_ENDPOINT,
        clientId: env.AZURE_AD_B2C_CLIENT_ID,
        clientSecret: env.AZURE_AD_B2C_CLIENT_SECRET,
        authorization: {
          url: env.AZURE_AD_B2C_AUTH_ENDPOINT,
          params: {
            scope: `https://dev002DataHubB2C.onmicrosoft.com/backend-bff/api openid profile email`
          }
        }
      }) as Provider
    ]
  };
  return authOptions;
}) satisfies Handle;
