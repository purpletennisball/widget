import type { App } from "obsidian";
import type { PTBWidgetPluginSettings } from "./settings";

export class CalendarService {
	constructor(private app: App, private settings: PTBWidgetPluginSettings) {}

	getDaysInMonth(year: number, month: number) {
    	return new Date(year, month + 1, 0).getDate();
	}

	getDaysInMonthByDate(date: Date) {
    	return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	}

	static formatYMD(dateString: string): Date {
		const [year, month, day] = dateString.split('-').map(Number) as [number, number, number];

		let date = new Date(year, month - 1, day);
		date.setHours(23, 59, 59, 0);
		return date;
	}
}