import * as rrule_pkg from 'rrule';
const { rrulestr, datetime } = rrule_pkg;


export const parser = async (icsText: string, endDate: Date): Promise<calendarObject> => {
	
	//GLOBAL PROPERTIES
	const lines = icsText.replaceAll("\t", "").split(/\r\n|\n|\r/)

	let calendarObj: calendarObject = {
		name: "",
		color: "",
		rawEvents: [],
		formattedEvents: [],
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
				
				else if (key?.includes("RECURRENCE-ID")) iteratorProperties.eventInProcessing.recurrenceId = parseDate(value)

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


					//INSERT ALL OF THE RECURRING EVENTS IN ARRAY --------------------------------------------------
					if (iteratorProperties.rrule_string != "") {
						// console.log('-----------------------------------------------------')
						// console.log(`Event: ${iteratorProperties.eventInProcessing}\nRRULE:${iteratorProperties.rrule_string}`)
						// console.log('EXDATE_cache:', iteratorProperties.EXDATE_cache)

						iteratorProperties.rrule_string = `DTSTART:${getISOString(iteratorProperties.eventInProcessing.start)}\nRRULE:${iteratorProperties.rrule_string}`
						// console.log("RRULE_STRING: " + iteratorProperties.rrule_string)

						const recurrenceRule = rrulestr(iteratorProperties.rrule_string, { dtstart: iteratorProperties.eventInProcessing.start, tzid: 'Etc/UTC',  forceset: true }) as rrule_pkg.RRuleSet


						//ADD EXDATES TO RRULE
						for (let exdate of iteratorProperties.EXDATE_cache) {
							recurrenceRule.exdate(exdate)
						}
						// console.log("Dates tested: ")
						const recurrenceDates = recurrenceRule.all(function (date: Date, i: number) { 
							// console.log(date)
							return date.valueOf() < endDate.valueOf() 
						})
						
						// console.log("Dates Added: ")
						
						for (let date of recurrenceDates) {					
							const copyOfCurrentEvent = new icalEvent(iteratorProperties.eventInProcessing)

							const eventLength = copyOfCurrentEvent.length

							copyOfCurrentEvent.start = new Date(date.toISOString())

							const endDate = new Date(date.toISOString())

							endDate.setMilliseconds(endDate.getMilliseconds() + (eventLength * 60 * 60 * 1000))

							copyOfCurrentEvent.end = endDate


							// console.log(copyOfCurrentEvent.start)
							
							calendarObj.rawEvents.push(new icalEvent(copyOfCurrentEvent))
						}
					} 
					//JUST ADD THE ONE EVENT TO THE ARRAY --------------------------------------------------
					else {
						// console.log("Dates Added (NR): ", iteratorProperties.eventInProcessing.start)
						calendarObj.rawEvents.push(new icalEvent(iteratorProperties.eventInProcessing))
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

	// Removes all the events with a lower sequence number but the same date/uid
	for (const [index, event_id] of calendarObj.event_ids.entries()) {
		const relatedEvents = calendarObj.rawEvents.filter(x=>x.uid == event_id)
		const removeEvents: icalEvent[] = []

		// if (relatedEvents.length > 0 && relatedEvents[0].name=="Staff Devo") console.log(relatedEvents)

		for (let i = 0; i < relatedEvents.length; i++) {
			for (let k = 0; k < relatedEvents.length; k++) {
				if (k == i) continue

				const eventToRemove = compareForOutdatedEvent(relatedEvents[i], relatedEvents[k])
				if (eventToRemove != null) {
					// console.log(eventToRemove)
					if (eventToRemove.name == "Staff Devo") console.log("================== REMOVE =================", eventToRemove, "================== ========= =================")
					removeEvents.push(eventToRemove)
				}
			}
		}

		
		for (const removeEvent of removeEvents) {
			calendarObj.rawEvents[calendarObj.rawEvents.indexOf(removeEvent)] = new icalEvent()
		}
	}

	calendarObj.formattedEvents = calendarObj.rawEvents.filter((x)=>x.name != "").map(x=>x.toJSON())
	
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
		
		return parsedDate
	}
	catch {
		return datetime(0,0,1,0,0,0)
	} finally {
		
	}
}

function getISOString (date: Date) {
	const dateWithMiliseconds = date.toISOString().replaceAll('-',"").replaceAll(':',"").replaceAll('.',"")
	return dateWithMiliseconds.substring(0,15) + "Z"
}

function compareForOutdatedEvent (event1: icalEvent, event2: icalEvent) {
	if (event1.uid == event2.uid) {
		if (event1.name == "Staff Devo") {
			// console.log(`COMPARE -------------------------------------------------------------`)
			// console.log(`..........EVENT 1.............`)
			// console.log(event1)
			// console.log(`..........EVENT 2.............`)
			// console.log(event2)
			// console.log(`--------------------------------------------------------------------`)
		}
		// If event1 is a ghost event but event2 has the same recurrendId as event2
		if (event1.recurrenceId?.valueOf() == null) {
			if (event1.start.valueOf() == event2.recurrenceId?.valueOf()) {
				// console.log("event1.start.valueOf() == event2.recurrenceId?.valueOf()")
				return event1
			}
		}
		//If event2 recurrence contains start date of event1 and event2 has mismatched data
		else if (event2.recurrenceId?.valueOf() != null) {
			if (event2.recurrenceId?.valueOf() != event2.start.valueOf()) {
				if (event2.recurrenceId?.valueOf() == event1.start.valueOf()) {
					// console.log("event2.recurrenceId?.valueOf() != event1.start.valueOf()")
					return event1
				}
			}
		}
		else if (event1.start.getDate() == event2.start.getDate()) {
			if (event1.start.getMonth() == event2.start.getMonth()) {
				if (event1.start.getFullYear() == event2.start.getFullYear()) {
					if (event1.sequence < event2.sequence) {
						// console.log("event1.sequence < event2.sequence")
						return event1
					}
				}
			}
		}
	}
	return null
}

function resetIteratorProperties (iteratorProperties: iterator) {
	iteratorProperties.currentType = ""
	iteratorProperties.rrule_string = ""
	iteratorProperties.EXDATE_cache = []
	iteratorProperties.eventInProcessing = new icalEvent()
}

/* ----------------------------------------- TYPES ---------------------------------------------*/

type calendarObject = {
	name: string,
	color: string,
	rawEvents: icalEvent[],
	formattedEvents: formatted_icalEvent[],
	event_ids: string[]
}

type iterator = {
	currentType: string,
	rrule_string: string,
	EXDATE_cache: Date[],
	eventInProcessing: icalEvent
}

export type formatted_icalEvent = {
	name: string,	
	start: Date
	end: Date
	length: number
	created: Date
	uid: string
	from: string
	isRequired: boolean
	isRelational: boolean
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
	recurrenceId: Date | null

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
		this.recurrenceId = event?.recurrenceId || null
	}

	public get length() {
		return (((this.end.valueOf() - this.start.valueOf()) / 1000) / 60) / 60;
	}

	toJSON() {
		return {
			name: this.name,			
			start: this.start,
			end: this.end,
			length: this.length,
			created: this.created,
			uid: this.uid,
			from: this.from,
			isRequired: this.isRequired,
			isRelational: this.isRelational
		}
	  }

	toString() {
		return `Name: ${this.name}\nStart:${this.start}\nEnd:${this.end}`
	}
}