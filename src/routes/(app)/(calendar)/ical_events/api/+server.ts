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

        return json(addEmptyDates(daysAr.map(x=>{
            return {
                date: new Date(x.date),
                length: x.events.reduce((agg, cur) => {
                    return agg + cur.length
                }, 0)
            }
        }).sort((a,b) => compareDates(a.date,b.date))).sort((a,b) => compareDates(a.date,b.date)))
    }
    
    return json(allEvents)
};

type allDaysHolder = {
    date: string
    events: icalEvent[]
}

type finalDateOutput = {
    date: Date,
    length: number
}

function compareDates (a: Date, b: Date) {
    return a.valueOf() - b.valueOf();
}

function addEmptyDates (dateAr: finalDateOutput[]) {

    const dateArWithEmpty = [...dateAr]
    
    const firstDate = dateAr[0].date
    const lastDate = dateAr[dateAr.length-1].date


    let dateIterator = new Date(firstDate.toISOString())

    const increment = () => {
        dateIterator.setDate(dateIterator.getDate() + 1)
    }


    while (dateIterator.valueOf() < lastDate.valueOf()) {
        increment()

        const indexOfDateIterator = dateAr.map(x=>x.date.toLocaleDateString()).indexOf(dateIterator.toLocaleDateString())

        if (indexOfDateIterator == -1) {
            // console.log('NOT FOUND: ' + dateIterator.toLocaleDateString())
            dateArWithEmpty.push({
                date: new Date (dateIterator.toISOString()),
                length: 0
            })
        }
    }

    return dateArWithEmpty
}