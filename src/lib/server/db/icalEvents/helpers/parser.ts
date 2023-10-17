export const parser = async (icsText: string): Promise<calendarObject> => {

	const lines = icsText.replaceAll("\t", "").split(/\r\n|\n|\r/)

	let currentType = ""
	let calendarObj: calendarObject = {
		name: "",
		color: "",
		events: []
	}

	const currentEvent = () => { return calendarObj.events[calendarObj.events.length-1] }

	for (const line of lines) {
		// console.log(`in: ${line}`)

		if (line.substring(0,6) == "BEGIN:") {
			const textAfterBegin = line.substring(6)

			if (textAfterBegin.length > 0) currentType = textAfterBegin
			if (currentType == "VEVENT") calendarObj.events.push({} as icalEvent)
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
					else if (key == "UID") currentEvent().uid = value
					else if (key == "END") { currentEvent().length = (((currentEvent().end.valueOf() - currentEvent().start.valueOf()) / 1000) / 60) / 60; currentEvent().from = calendarObj.name;}
					break;

				default:
					break;
			}
		}

	}

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

		return new Date(year, month, day, hours, minutes, seconds)
	}
	catch {
		return new Date(0,0,1,0,0,0)
	} finally {
		
	}
}

type calendarObject = {
	name: string,
	color: string,
	events: icalEvent[]
}

export type icalEvent = {
	created: Date,
	start: Date,
	end: Date,
	length: number
	name: string,
	uid: string,
	from: string
}