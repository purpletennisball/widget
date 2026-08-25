import type { App } from "obsidian";
import type { PTBWidgetPluginSettings } from "../../settings";

export class Timer {
	constructor(private id: number, private startTime: number) {}
}

export class TimerService {
	timers: Timer[] = []

	constructor(private app: App, private settings: PTBWidgetPluginSettings) {}
}