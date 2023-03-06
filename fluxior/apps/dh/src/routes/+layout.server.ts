import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.getSession();
  console.log({ session });
  return {
    session
  };
};
