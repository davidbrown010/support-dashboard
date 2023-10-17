import { getAllICalEvents } from '$lib/server/db/icalEvents/handler';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import type { icalEvent } from '$lib/server/db/icalEvents/helpers/parser';

export const GET: RequestHandler =  async ({url}) => {
    const breakdownDimension = url.searchParams.get("breakdownDimension")

    const allEvents = await getAllICalEvents()

    if (breakdownDimension == "event") return json(allEvents)
    else if (breakdownDimension == "date") {
        let daysAr = [] as allDaysHolder[]

        for (const event of allEvents) {
            const indexOfDaysAr = daysAr.map(x=>x.date).indexOf(event.start.toDateString())
            if (indexOfDaysAr == -1) {
                daysAr.push({
                    date: event.start.toDateString(),
                    events: [event]
                })
            } else {
                daysAr[indexOfDaysAr].events.push(event)
            }
        }

        return json(daysAr.map(x=>{
            return {
                date: new Date(x.date),
                length: x.events.reduce((agg, cur) => {
                    return agg + cur.length
                }, 0)
            }
        }))

    }
    
    return json(allEvents)
};

type allDaysHolder = {
    date: string
    events: icalEvent[]
}