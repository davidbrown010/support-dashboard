import { getICalEventsFromCalendar } from '$lib/server/db/icalEvents/handler';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import {convertToDateSeries} from '$lib/server/db/icalEvents/helpers/convertToDateSeries'

export const GET: RequestHandler =  async ({url, params}) => {
    const breakdownDimension = url.searchParams.get("breakdownDimension")
    const ical_URL = url.searchParams.get("url") || ""

    const yearAgo = new Date()
    yearAgo.setFullYear(yearAgo.getFullYear() - 1)
    const today = new Date()

    const startDate = url.searchParams.get("startDate") == null ? yearAgo : new Date(url.searchParams.get("startDate")!)
    const endDate = url.searchParams.get("endDate") == null ? today : new Date(url.searchParams.get("endDate")!)

    const allEvents = await getICalEventsFromCalendar(ical_URL, startDate, endDate)

    if (breakdownDimension == "event") return json(allEvents)
    else if (breakdownDimension == "date") return json(convertToDateSeries(allEvents))
    
    return json(allEvents)
};


