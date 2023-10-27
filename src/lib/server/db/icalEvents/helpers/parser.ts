export const parser = async (icsText: string): Promise<calendarObject> => {

	const lines = icsText.replaceAll("\t", "").split(/\r\n|\n|\r/)

	let currentType = ""
	let calendarObj: calendarObject = {
		name: "",
		color: "",
		events: [],
		event_ids: []
	}

	const nullEvent: icalEvent = {
		created: new Date(),
		start: new Date(),
		end: new Date(),
		length: -1,
		name: '',
		uid: '',
		from: '',
		sequence: -1,
		isRequired: false,
		isRelational: false
	}

	const currentEvent = () => { return calendarObj.events[calendarObj.events.length-1] }

	let RRULE = {} as RR_Rule
	let EXDATE_cache: Date[] = []

	for (const line of lines) {
		// console.log(`in: ${line}`)

		if (line.substring(0,6) == "BEGIN:") {
			const textAfterBegin = line.substring(6)

			if (textAfterBegin.length > 0) currentType = textAfterBegin
			if (currentType == "VEVENT") {
				calendarObj.events.push({} as icalEvent)
				RRULE = {} as RR_Rule
			}
		} else {
			
			const {key, value} = keyVal(line)
			switch (currentType) {
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
				case "VEVENT":
					if (key == "CREATED") currentEvent().created = parseDate(value)
					else if (key?.includes("DTEND")) currentEvent().end = parseDate(value)
					else if (key?.includes("DTSTART")) currentEvent().start = parseDate(value)
					else if (key == "SUMMARY") currentEvent().name = value
					else if (key?.includes("RRULE")) RRULE = parseRRule(value)
					else if (key == "UID") { 
						currentEvent().uid = value
						if (calendarObj.event_ids.indexOf(value) == -1) calendarObj.event_ids.push(value)
					}
					else if (key == "SEQUENCE") currentEvent().sequence = parseInt(value)
					else if (key?.includes("EXDATE")) EXDATE_cache.push(parseDate(value))
					else if (key == "END") {
						currentEvent().length = (((currentEvent().end.valueOf() - currentEvent().start.valueOf()) / 1000) / 60) / 60;
						currentEvent().from = calendarObj.name;
						currentEvent().isRequired = currentEvent().from.includes('(R)')
						currentEvent().isRelational = currentEvent().from.includes('Relational')

						const newDates = RRULEtoDates(RRULE, EXDATE_cache)
						
						// newDates.forEach((date) => {							

						// 	const copyOfCurrentEvent = {...currentEvent()}
						// 	copyOfCurrentEvent.start = date

						// 	calendarObj.events.push(copyOfCurrentEvent)
							
							
						// })
						// RRULE:FREQ=WEEKLY;UNTIL=20230818T213000Z;BYDAY=TH,FR

						EXDATE_cache = []
					}
					break;

				default:
					break;
			}
		}

	}

	//Removes all the events with a lower sequence number but the same date/uid
	for (const [index, event_id] of calendarObj.event_ids.entries()) {
		const relatedEvents = calendarObj.events.filter(x=>x.uid == event_id)
		const removeEvents: icalEvent[] = []

		for (let i = 0; i < relatedEvents.length; i++) {
			for (let k = i+1; k < relatedEvents.length; k++) {
				const eventToRemove = compareForOutdatedEvent(relatedEvents[i], relatedEvents[k])
				if (eventToRemove != null) {
					removeEvents.push(eventToRemove)
				}
			}
		}

		for (const removeEvent of removeEvents) {
			calendarObj.events[calendarObj.events.indexOf(removeEvent)] = nullEvent
		}
	}

	calendarObj.events = await calendarObj.events.filter((x)=>x.name != "")

	return calendarObj
}

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

		let parsedDate = new Date(year, month, day, hours, minutes, seconds)
		parsedDate.setMonth(parsedDate.getMonth() - 1)
		
		return parsedDate
	}
	catch {
		return new Date(0,0,1,0,0,0)
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
//RRULE:FREQ=WEEKLY;UNTIL=20230818T213000Z;BYDAY=TH,FR
function parseRRule (rrule_text: string) {
	const rrule_parse = rrule_text.replaceAll("RRULE:", "").split(';').map(x=>{
		const [key, val] = x.split("=")
		return {[key]: val}
	}).reduce((agg, cur) => {
		return {
			...agg,
			...cur
		}
	}, {})

	const rrule_typed_obj: RR_Rule = {
		frequency: rrule_parse?.FREQ as RR_Frequency,
		until: parseDate(rrule_parse?.UNTIL),
		by_month: rrule_parse?.BYMONTH?.split(','),
		by_day: rrule_parse?.BYDAY?.split(','),
		count: rrule_parse?.COUNT ? parseInt(rrule_parse?.COUNT) : null,
		interval: rrule_parse?.INTERVAL ? parseInt(rrule_parse?.INTERVAL) : null
	}

	return rrule_typed_obj

}

function RRULEtoDates (rrule: RR_Rule, EXDATE_cache: Date[]) {

}

type calendarObject = {
	name: string,
	color: string,
	events: icalEvent[],
	event_ids: string[]
}

export type icalEvent = {
	created: Date,
	start: Date,
	end: Date,
	length: number
	name: string,
	uid: string,
	from: string,
	sequence: number,
	isRequired: boolean,
	isRelational: boolean
}

//RRULE:FREQ=WEEKLY;UNTIL=20230818T213000Z;BYDAY=TH,FR

type RR_Rule = {
	frequency: RR_Frequency,
	until: Date,
	by_month: string[] | null,
	by_day: string[] | null,
	count: number | null,
	interval: number | null
}

type RR_Frequency = "DAILY" | "WEEKLY" | "MONTHLY" | null