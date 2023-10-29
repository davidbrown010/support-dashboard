import { icalEventCategoryTable, icalEventsTable, icalCalendarTable, lookerReportTable } from "./schema";
import { db } from "$lib/server/db/drizzle";
import { parser } from "./helpers/parser";
import { eq } from "drizzle-orm";
import type { formatted_icalEvent } from "./helpers/parser";

export const getAllEnhancedMetaData = async () => {
    const selectResult = await db.select().from(icalEventsTable);
    // console.log('Results', selectResult);
    return selectResult;
};

export const getAllCategories = async () => {
    const selectResult = await db.select().from(icalEventCategoryTable);
    return selectResult;
};

export const getAlliCalCalendars = async (userId: string) => {
    const selectResult = await db.select().from(icalCalendarTable).where(eq(icalCalendarTable.userFK, userId))
    return selectResult
}

export const getAllEnhancedEvents = async () => {

}

export const modifyEnhancedEvent = async (uid: string, categoryId: number) => {
    const result = await db.update(icalEventsTable)
        .set({ categoryFK: categoryId })
        .where(eq(icalEventsTable.id, uid));

    console.log(result)
}

const compareDates = (a: formatted_icalEvent, b: formatted_icalEvent) => {
    return a.start.valueOf() - b.start.valueOf();
}

export const getAllICalEvents = async (userId: string, beginDate: Date, endDate: Date) => {

    const getEventsFromICal = async () => {

        const calendars = await getAlliCalCalendars(userId)

        const calendarWithEvents = await Promise.all(calendars.map(async (calendar) => {

            const icsResponse = await fetch(cleanICalURL(calendar.url))

            const icsAsText = await icsResponse.text()


            const parsedCalendar = await parser(icsAsText, endDate)

            
            return {
                ...calendar,
                ...parsedCalendar
            }
        }))
        
        const allEvents: formatted_icalEvent[] = calendarWithEvents.reduce((agg, cur) => {

            const calendarName = cur.name
            
            const events = cur.formattedEvents

            return [...agg, ...events]

        }, [] as formatted_icalEvent[])

        return allEvents.filter(x=>x.start > beginDate && x.end < endDate).sort((a,b) => compareDates(a,b))

    }

    const events = await getEventsFromICal()
    
    return events

}

export const getICalEventsFromCalendar = async (url: string, beginDate: Date, endDate: Date) => {

    const getEventsFromICal = async (url: string) => {

        const icsResponse = await fetch(cleanICalURL(url))

        const icsAsText = await icsResponse.text()

        const {formattedEvents} = await parser(icsAsText, endDate)

        return formattedEvents.filter(x=>x.start > beginDate && x.end < endDate).sort((a,b) => compareDates(a,b))

    }

    const events = await getEventsFromICal(url)
    
    return events
}

function cleanICalURL (url: string) {
	const prefixReplace = [{before: 'webcal://', after: 'http://'}]

	return prefixReplace.reduce((agg, cur) => {
		return agg.replaceAll(cur.before, cur.after)
	}, url)
}

export const getLookerReports = async (userId: string) => {
    const selectResult = await db.select().from(lookerReportTable).where(eq(lookerReportTable.userFK, userId))
    return selectResult
}