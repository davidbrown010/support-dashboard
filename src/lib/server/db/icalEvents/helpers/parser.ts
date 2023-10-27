import * as rrule_pkg from 'rrule';
const { rrulestr, datetime } = rrule_pkg;


export const parser = async (icsText: string, endDate: Date): Promise<calendarObject> => {

	//GLOBAL PROPERTIES
	const lines = icsText.replaceAll("\t", "").split(/\r\n|\n|\r/)

	let calendarObj: calendarObject = {
		name: "",
		color: "",
		events: [],
		event_ids: []
	}

	let iteratorProperties: iterator = {
		currentType: "",
		rrule_string: '',
		EXDATE_cache: [],
		eventInProcessing: new icalEvent()
	}




	//GOES THROUGH EACH LINE IN THE .ICS STRING
	for (const line of lines) {

		//SETS THE CURRENT TYPE
		if (line.substring(0,6) == "BEGIN:") {
			const textAfterBegin = line.substring(6)
			if (textAfterBegin.length > 0) {
				resetIteratorProperties(iteratorProperties)
				iteratorProperties.currentType = textAfterBegin
			}
		}
		//EXITS IF THERE ISN'T A CURRENT TYPE
		if (iteratorProperties.currentType == "") continue;
		
		//GETS THE KEY/VALUE PAIR FOR THE LINE
		const {key, value} = keyVal(line)


		switch (iteratorProperties.currentType) {
			//------------------------------------------ VCALENDAR -----------------------------------------------
			case "VCALENDAR":
				switch (key) {
					case "X-WR-CALNAME":
						calendarObj.name = value;
						break;
					case "X-APPLE-CALENDAR-COLOR":
						calendarObj.color = value;
						break;
				}
				break;


			//------------------------------------------ VEVENT -----------------------------------------------
			case "VEVENT":
				if (key == "CREATED") iteratorProperties.eventInProcessing.created = parseDate(value)

				else if (key?.includes("DTEND")) iteratorProperties.eventInProcessing.end = parseDate(value)

				else if (key?.includes("DTSTART")) iteratorProperties.eventInProcessing.start = parseDate(value)

				else if (key == "SUMMARY") iteratorProperties.eventInProcessing.name = value

				else if (key?.includes("RRULE")) iteratorProperties.rrule_string = value

				else if (key == "UID") { 
					iteratorProperties.eventInProcessing.uid = value
					if (calendarObj.event_ids.indexOf(value) == -1) calendarObj.event_ids.push(value)
				}

				else if (key == "SEQUENCE") iteratorProperties.eventInProcessing.sequence = parseInt(value)

				else if (key?.includes("EXDATE")) iteratorProperties.EXDATE_cache.push(parseDate(value))
				
				else if (key == "END") {
					
					iteratorProperties.eventInProcessing.from = calendarObj.name;
					iteratorProperties.eventInProcessing.isRequired = iteratorProperties.eventInProcessing.from.includes('(R)')
					iteratorProperties.eventInProcessing.isRelational = iteratorProperties.eventInProcessing.from.includes('Relational')

					// console.log('-----------------------------------------------------')
					// console.log(`Event: ${iteratorProperties.eventInProcessing}\nRRULE:${iteratorProperties.rrule_string}`)
					// console.log('EXDATE_cache:', iteratorProperties.EXDATE_cache)

					//INSERT ALL OF THE RECURRING EVENTS IN ARRAY --------------------------------------------------
					if (iteratorProperties.rrule_string != "") {
						const recurrenceRule = rrulestr(iteratorProperties.rrule_string, { dtstart: iteratorProperties.eventInProcessing.start, tzid: 'Etc/UTC',  forceset: true }) as rrule_pkg.RRuleSet
						
						for (let exdate of iteratorProperties.EXDATE_cache) {
							recurrenceRule.exdate(exdate)
						}

						const recurrenceDates = recurrenceRule.all(function (date: Date, i: number) { return date.valueOf() < endDate.valueOf() })
						
						// console.log("Dates Added: ")
						
						for (let date of recurrenceDates) {					
							const copyOfCurrentEvent = new icalEvent(iteratorProperties.eventInProcessing)
							copyOfCurrentEvent.start = date
							copyOfCurrentEvent.end = date

							// console.log(copyOfCurrentEvent.start)

							calendarObj.events.push({...copyOfCurrentEvent} as icalEvent)
						}
					} 
					//JUST ADD THE ONE EVENT TO THE ARRAY --------------------------------------------------
					else {
						// console.log("Dates Added: ", iteratorProperties.eventInProcessing.start)
						calendarObj.events.push({...iteratorProperties.eventInProcessing} as icalEvent)
					}
					//THE EVENT HAS FINISHED PARSING
				}
				break;
			
			//ADD MORE TYPES HERE, OTHERWISE IGNORE
			default:
				break;

		//END OF SWITCH
		}
		

	}

	//Removes all the events with a lower sequence number but the same date/uid
	// for (const [index, event_id] of calendarObj.event_ids.entries()) {
	// 	const relatedEvents = calendarObj.events.filter(x=>x.uid == event_id)
	// 	const removeEvents: icalEvent[] = []

	// 	for (let i = 0; i < relatedEvents.length; i++) {
	// 		for (let k = i+1; k < relatedEvents.length; k++) {
	// 			const eventToRemove = compareForOutdatedEvent(relatedEvents[i], relatedEvents[k])
	// 			if (eventToRemove != null) {
	// 				removeEvents.push(eventToRemove)
	// 			}
	// 		}
	// 	}

	// 	for (const removeEvent of removeEvents) {
	// 		calendarObj.events[calendarObj.events.indexOf(removeEvent)] = nullEvent
	// 	}
	// }

	calendarObj.events = await calendarObj.events.filter((x)=>x.name != "")

	return calendarObj
}


/* ----------------------------------------- HELPER FUNCTIONS ---------------------------------------------*/

function keyVal (lineOfText: string) {
	if (lineOfText.includes(":")) {
		const indexOfSplit = lineOfText.indexOf(':')

		return {
			key: lineOfText.substring(0,indexOfSplit),
			value: lineOfText.substring(indexOfSplit+1, lineOfText.length)
		}
	}
	else return {
		key: null,
		value: null
	}
}

function parseDate (dateAsString: string) {

	try {
		const [date, time] = dateAsString.split("T")

		const year = parseInt(date.substring(0,4))
		const month = parseInt(date.substring(4,6))
		const day = parseInt(date.substring(6,8))

		const hours = parseInt(time.substring(0,2))		
		const minutes = parseInt(time.substring(2,4))
		const seconds = parseInt(time.substring(4,6))

		let parsedDate = datetime(year, month, day, hours, minutes, seconds)
		parsedDate.setMonth(parsedDate.getMonth() - 1)
		
		return parsedDate
	}
	catch {
		return datetime(0,0,1,0,0,0)
	} finally {
		
	}
}

function compareForOutdatedEvent (event1: icalEvent, event2: icalEvent) {
	if (event1.uid == event2.uid) {
		if (event1.start.getDate() == event2.start.getDate()) {
			if (event1.start.getMonth() == event2.start.getMonth()) {
				if (event1.start.getFullYear() == event2.start.getFullYear()) {
					if (event1.sequence >= event2.sequence) return null
					else if (event1.sequence < event2.sequence) return event1
				}
			}
		}
	}
	return null
}

function resetIteratorProperties (iteratorProperties: iterator) {
	return {
		currentType: iteratorProperties.currentType = "",
		rrule_string: iteratorProperties.rrule_string = "",
		EXDATE_cache: iteratorProperties.EXDATE_cache = [],
		eventInProcessing: new icalEvent()
	} as iterator
}

/* ----------------------------------------- TYPES ---------------------------------------------*/

type calendarObject = {
	name: string,
	color: string,
	events: icalEvent[],
	event_ids: string[]
}

type iterator = {
	currentType: string,
	rrule_string: string,
	EXDATE_cache: Date[],
	eventInProcessing: icalEvent
}

export class icalEvent {
	created: Date
	start: Date
	end: Date
	name: string
	uid: string
	from: string
	sequence: number
	isRequired: boolean
	isRelational: boolean

	constructor(event: icalEvent | null = null) {
		const now = new Date()
		this.created = event?.created || now
		this.start = event?.start || now
		this.end = event?.end || now
		this.name = event?.name || ""
		this.uid = event?.uid || ""
		this.from = event?.from || ""
		this.sequence = event?.sequence || -1
		this.isRequired = event?.isRequired || false
		this.isRelational = event?.isRelational || false
	}

	get length() {
		return (((this.end.valueOf() - this.start.valueOf()) / 1000) / 60) / 60;
	}

	toString() {
		return `Name: ${this.name}\nStart:${this.start}`
	}
}