import { DefaultJWT } from '@auth/core/jwt';

declare module '@auth/core/jwt' {
  export interface JWT extends Record<string, unknown>, DefaultJWT {
    accessToken: string;
  }
}
