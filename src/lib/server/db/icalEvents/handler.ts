import { icalEventCategoryTable, icalEventsTable } from "./schema";
import { db } from "$lib/server/db/drizzle";
import { parser } from "./helpers/parser";
import { eq } from "drizzle-orm";
import type { icalEvent } from "./helpers/parser";

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

const compareDates = (a: icalEvent, b: icalEvent) => {
    return a.start.valueOf() - b.start.valueOf();
}

export const getAllICalEvents = async () => {

    const beginDate = new Date(2023, 7, 21)
    const endDate = new Date(2023, 12, 1)

    

    const getEventsFromICal = async () => {

        const calendars = [
            {
                displayName: "Chi Alpha",
                url: "http://p151-caldav.icloud.com/published/2/MTA0Nzc2MTU4NzYxMDQ3N6fMTSiI4G46FbxeaKpJRm57iLmBPZ0OPCwFGrMOEnUivD_zqr8V_d2-FECGEHI-zTTDbtPmjbupu46f0ozQJCE"
            },
            {
                displayName: "Team David",
                url: "http://p151-caldav.icloud.com/published/2/MTA0Nzc2MTU4NzYxMDQ3N6fMTSiI4G46FbxeaKpJRm4-4jd8xw4Yw9QKb9TSlY2kzDCNYFe7hkOWQSBFEkFYfJuYntrNfbaalAQuFPcyhIY"
            },
            {
                displayName: "Intern Work",
                url: "http://p151-caldav.icloud.com/published/2/MTA0Nzc2MTU4NzYxMDQ3N6fMTSiI4G46FbxeaKpJRm69Q8xuVSY7y7cShX9W7yt0IqPV3dD0kBnK2j-biYSRwMl-V5pmUWwpJ9m_9qoPdhg"
            }
        ]

        

        const calendarWithEvents = await Promise.all(calendars.map(async (calendar) => {

            const icsResponse = await fetch(calendar.url)

            const icsAsText = await icsResponse.text()


            const parsedCalendar = await parser(icsAsText)

            
            return {
                ...calendar,
                ...parsedCalendar
            }
        }))
        
        const allEvents: icalEvent[] = calendarWithEvents.reduce((agg, cur) => {

            const calendarName = cur.name
            
            const events = cur.events

            return [...agg, ...events]

        }, [] as icalEvent[])

        return allEvents.filter(x=>x.start > beginDate && x.end < endDate).sort((a,b) => compareDates(a,b))

    }

    const events = await getEventsFromICal()
    
    return events

}
