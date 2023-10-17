import { icalEventCategoryTable, icalEventsTable } from "./schema";
import { db } from "$lib/server/db/drizzle";
import ical from "node-ical";
import { eq } from "drizzle-orm";

export const getAllEnhancedMetaData = async () => {
    const selectResult = await db.select().from(icalEventsTable);
    // console.log('Results', selectResult);
    return selectResult;
};

export const getAllCategories = async () => {
    const selectResult = await db.select().from(icalEventCategoryTable);
    return selectResult;
};

export const getAllEnhancedEvents = async () => {

}

export const modifyEnhancedEvent = async (uid: string, categoryId: number) => {
    const result = await db.update(icalEventsTable)
        .set({ categoryFK: categoryId })
        .where(eq(icalEventsTable.id, uid));

    console.log(result)
}

type icalEvent = {
    name: string,
    start: Date,
    end: Date,
    length: number,
    from: string,
    uid: string
}


export const getAllICalEvents = async () => {

    const beginDate = new Date(2023, 7, 21)
    const endDate = new Date(2023, 10, 1)

    const compareDates = (a: icalEvent, b: icalEvent) => {
        return a.start.valueOf() - b.start.valueOf();
    }

    const getEventsFromICal = async () => {

        const calendars = [
            {
                name: "Chi Alpha",
                url: "http://p151-caldav.icloud.com/published/2/MTA0Nzc2MTU4NzYxMDQ3N6fMTSiI4G46FbxeaKpJRm57iLmBPZ0OPCwFGrMOEnUivD_zqr8V_d2-FECGEHI-zTTDbtPmjbupu46f0ozQJCE"
            },
            {
                name: "Team David",
                url: "http://p151-caldav.icloud.com/published/2/MTA0Nzc2MTU4NzYxMDQ3N6fMTSiI4G46FbxeaKpJRm4-4jd8xw4Yw9QKb9TSlY2kzDCNYFe7hkOWQSBFEkFYfJuYntrNfbaalAQuFPcyhIY"
            },
            {
                name: "Intern Work",
                url: "http://p151-caldav.icloud.com/published/2/MTA0Nzc2MTU4NzYxMDQ3N6fMTSiI4G46FbxeaKpJRm69Q8xuVSY7y7cShX9W7yt0IqPV3dD0kBnK2j-biYSRwMl-V5pmUWwpJ9m_9qoPdhg"
            }
        ]

        

        const calendarWithEvents = await Promise.all(calendars.map(async (calendar) => {

            const eventData = await ical.async.fromURL(calendar.url)
            
            return {
                ...calendar,
                events: Object.entries(eventData)
            }
        }))
        
        const allEvents: icalEvent[] = calendarWithEvents.reduce((agg, cur) => {

            const calendarName = cur.name
            
            const events = cur.events

            return [...agg, ...events.reduce((eventAgg, eventCur) => {
                const ev = eventCur[1];
                const uid = eventCur[0];

                if (ev.type == 'VEVENT') {
                    return [...eventAgg, {
                        name: ev.summary,
                        start: ev.start,
                        end: ev.end,
                        length: (((ev.end.valueOf() - ev.start.valueOf()) / 1000) / 60) / 60,
                        from: calendarName,
                        uid
                    }]
                }

                return eventAgg
            }, [] as icalEvent[])]

        }, [] as icalEvent[])

        return allEvents.filter(x=>x.start > beginDate && x.end < endDate).sort((a,b) => compareDates(a,b))

    }


    return getEventsFromICal()

}