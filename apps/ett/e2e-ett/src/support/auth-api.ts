export const allowAuthentication = () =>
  cy
    .intercept(
      {
        hostname: 'localhost',
        method: 'GET',
        pathname: '/api/auth/oidc/login',
      },
      {
        next_url: '/dashboard?success=1',
      }
    )
    .as('authOidcLogin');

export const allowLogOut = () =>
  cy
    .intercept(
      {
        hostname: 'localhost',
        method: 'GET',
        pathname: '/api/auth/logout',
      },
      {
        success: true,
      }
    )
    .as('authLogout');
