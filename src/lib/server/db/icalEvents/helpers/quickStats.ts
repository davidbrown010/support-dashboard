import type {formatted_icalEvent} from "./parser"

export const sumHours = (icalEvents: formatted_icalEvent[]) => {
    const totalHoursSummed: number = icalEvents.reduce((agg: number, cur: formatted_icalEvent) => {
        console.log(cur.name + ' - ' + cur.length)
        console.log(agg)
        return agg + cur.length
    }, 0)

    const relationalHoursSummed: number = icalEvents.reduce((agg: number, cur: formatted_icalEvent) => {
        return agg + (cur.isRelational ? cur.length : 0)
    }, 0)

    return {
        totalHours: totalHoursSummed,
        relationalHours: relationalHoursSummed
    }
}