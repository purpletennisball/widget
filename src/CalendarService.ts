export class CalendarService {
	constructor(private app: App, private settings: PTBWidgetPluginSettings) {}

	getDaysInMonth(year, month) {
    	return new Date(year, month + 1, 0).getDate();
	}

	getDaysInMonthByDate(date: Date) {
    	return new Date(date.getYear(), date.getMonth() + 1, 0).getDate();
	}

	getFirstDayForGridMonth(month) {
		let startDay = 0 // 0 is Sun, 1 is Mon

		let date = new Date();
		let startDateGrid = date

		let subtractDays = startDateGrid.getDay() - startDay
		startDateGrid.setDate(startDateGrid.getDate() - subtractDays);


	}

	
}