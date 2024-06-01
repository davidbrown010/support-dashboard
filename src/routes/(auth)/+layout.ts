import type { Config } from '@sveltejs/adapter-vercel';
import type { LayoutServerLoad } from '../(app)/$types';
import { redirect } from '@sveltejs/kit';
 
export const config: Config = {
  runtime: 'edge',
};

export const load: LayoutServerLoad = async (event) => {
  const sessionIsFresh = await event.locals?.session?.fresh
  if (sessionIsFresh) throw redirect(302, "/")
}