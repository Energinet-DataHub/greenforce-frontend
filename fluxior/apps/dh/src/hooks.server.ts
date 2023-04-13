import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import AzureADB2C from '@auth/core/providers/azure-ad-b2c';
import { env } from '$env/dynamic/private';
import type { Provider } from '@auth/core/providers';
import { setSession } from '$houdini';
import type { Handle } from '@sveltejs/kit';

export const handle = SvelteKitAuth(async (event) => {
  const authOptions: SvelteKitAuthConfig = {
    debug: false,
    secret: env.secret,
    callbacks: {
      async session({ session, token }) {
        session.accessToken = token.accessToken;
        setSession(event, token);
        return session;
      },
      async jwt({ token, account }) {
        if (account) {
          token.accessToken = account.access_token;
        }
        return token;
      }
    },
    providers: [
      AzureADB2C({
        issuer: 'https://devdatahubb2c.b2clogin.com/4a7411ea-ac71-4b63-9647-b8bd4c5a20e0/v2.0/',
        token:
          'https://devdatahubb2c.b2clogin.com/devdatahubb2c.onmicrosoft.com/b2c_1_signinflow/oauth2/v2.0/token',
        userinfo: 'https://graph.microsoft.com/oidc/userinfo',
        clientId: '1982d7c0-9b07-4c41-85ac-476967b10101',
        clientSecret: 'Pzu8Q~Rg5fnk.~mOyzsKbPLWyA6BuMPLesW7IaDD',
        authorization: {
          url: 'https://devdatahubb2c.b2clogin.com/devdatahubb2c.onmicrosoft.com/b2c_1_signinflow/oauth2/v2.0/authorize',
          params: {
            scope: '1982d7c0-9b07-4c41-85ac-476967b10101 openid profile email'
          }
        }
      }) as Provider
    ]
  };
  return authOptions;
}) satisfies Handle;
