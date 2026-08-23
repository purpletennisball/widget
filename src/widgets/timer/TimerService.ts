export class Timer {
	id: string
	startTime: number
}

export class TimerService {
	timers: Timer[] = []

	constructor(private app: App, private settings: PTBWidgetPluginSettings) {}
}