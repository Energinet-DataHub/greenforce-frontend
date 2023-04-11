import { SvelteKitAuth } from '@auth/sveltekit';
import AzureADB2C from '@auth/core/providers/azure-ad-b2c';
import { env } from '$env/dynamic/private';
import type { Provider } from '@auth/core/providers';

export const handle = SvelteKitAuth({
  debug: true,
  secret: env.secret,
  callbacks: {
    async jwt({ token, account, profile, isNewUser, user }) {
      console.log({ token, account, profile, isNewUser, user });
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    }
  },
  providers: [
    AzureADB2C({
      issuer:
        'https://devdatahubb2c.b2clogin.com/devdatahubb2c.onmicrosoft.com/b2c_1_signinflow/v2.0',
      token:
        'https://devdatahubb2c.b2clogin.com/devdatahubb2c.onmicrosoft.com/b2c_1_signinflow/oauth2/v2.0/token',
      userinfo: 'https://graph.microsoft.com/oidc/userinfo',
      clientId: '1982d7c0-9b07-4c41-85ac-476967b10101',
      clientSecret: 'Pzu8Q~Rg5fnk.~mOyzsKbPLWyA6BuMPLesW7IaDD',
      primaryUserFlow: 'b2c_1_signinflow',
      authorization: {
        params: { scope: '1982d7c0-9b07-4c41-85ac-476967b10101 openid profile email' }
      },
      profile: (profile) => {
        return {
          id: profile.sub,
          name: profile.name,
          image: null
        };
      }
    }) as Provider
  ]
});

// tenantId: 'fluxiororg',
//       clientId: '2047be93-878e-4360-9b43-ca6e7beb9b5b',
//       clientSecret: 'mJK8Q~GcXlnw861P7PbEbApud8k~MaaywYENpcR~',
//       primaryUserFlow: 'B2C_1A_SIGNUP_SIGNIN',
//       authorization: {
//         params: { scope: '2047be93-878e-4360-9b43-ca6e7beb9b5b openid profile email' }
//       },
