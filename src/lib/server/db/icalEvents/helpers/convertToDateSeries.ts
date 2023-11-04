import type { formatted_icalEvent } from "./parser"

export const convertToDateSeries = (allEvents: formatted_icalEvent[]) => {

    const daysAr = allEvents.reduce((agg, curEvent) => {
        const indexOfEvent = agg.map(x=>removeTimeStamp(x.date).valueOf()).indexOf(removeTimeStamp(curEvent.start).valueOf())
        
        if (indexOfEvent == -1) agg.push({ date: removeTimeStamp(curEvent.start), events: [curEvent] })

        else {
            agg[indexOfEvent].events.push(curEvent)
        }

        return agg
        
    }, [] as allDaysHolder[])


    const daysWithComputedData: finalDateOutput[] = daysAr.map(x=>{
        return {
            date: x.date,
            length: x.events.reduce((agg, cur) => {
                return agg + cur.length
            }, 0),
            lengthStructured: x.events.reduce((agg, cur) => {
                return agg + (cur.isStructured ? cur.length : 0)
            }, 0),
            lengthRelational: x.events.reduce((agg, cur) => {
                return agg + (cur.isRelational ? cur.length : 0)
            }, 0),
            length_structured_relational: x.events.reduce((agg, cur) => {
                return agg + (cur.isRelational && cur.isStructured ? cur.length : 0)
            }, 0),
            length_structured_notRelational: x.events.reduce((agg, cur) => {
                return agg + (!cur.isRelational && cur.isStructured ? cur.length : 0)
            }, 0),
            length_flexible_relational: x.events.reduce((agg, cur) => {
                return agg + (cur.isRelational && !cur.isStructured ? cur.length : 0)
            }, 0),
            length_flexible_notRelational: x.events.reduce((agg, cur) => {
                return agg + (!cur.isRelational && !cur.isStructured ? cur.length : 0)
            }, 0)
        }
    }).sort((a,b) => compareDates(a.date,b.date))


    return addEmptyDates(daysWithComputedData).sort((a,b) => compareDates(a.date,b.date))
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
                length: 0,
                lengthStructured: 0,
                lengthRelational: 0,
                length_structured_relational: 0,
                length_structured_notRelational: 0,
                length_flexible_relational: 0,
                length_flexible_notRelational: 0
            })
        }
    }

    return dateArWithEmpty
}

function removeTimeStamp (date: Date) {
    return new Date(date.toISOString().split('T')[0])
}


type allDaysHolder = {
    date: Date
    events: formatted_icalEvent[]
}

type finalDateOutput = {
    date: Date,
    length: number,
    lengthStructured: number,
    lengthRelational: number,
    length_structured_relational: number,
    length_structured_notRelational: number,
    length_flexible_relational: number,
    length_flexible_notRelational: number
}