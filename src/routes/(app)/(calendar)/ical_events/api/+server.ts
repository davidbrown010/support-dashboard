import { getAllICalEvents } from '$lib/server/db/icalEvents/handler';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler =  async () => {
    const allEvents = await getAllICalEvents()
    return json(allEvents);
};