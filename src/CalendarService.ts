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
}