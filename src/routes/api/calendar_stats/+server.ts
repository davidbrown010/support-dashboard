import { getAllICalEvents } from '$lib/server/db/icalEvents/handler';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { sumHours } from '$lib/server/db/icalEvents/helpers/quickStats';

export const GET: RequestHandler =  async ({url, locals}) => {
    const breakdownDimension = url.searchParams.get("breakdownDimension")

    const yearAgo = new Date()
    yearAgo.setFullYear(yearAgo.getFullYear() - 1)
    const today = new Date()

    const startDate = url.searchParams.get("startDate") == null ? yearAgo : new Date(url.searchParams.get("startDate")!)
    const endDate = url.searchParams.get("endDate") == null ? today : new Date(url.searchParams.get("endDate")!)

    const allEvents = await getAllICalEvents(locals.user.userId, startDate, endDate)

    // console.log(allEvents)

    const sumStats = sumHours(allEvents)

    console.log(sumStats)

    return json({
        sumStats
    })
};