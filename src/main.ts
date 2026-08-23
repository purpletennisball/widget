import {
	Editor,
	MarkdownView,
	type MarkdownFileInfo,
	Notice,
	Plugin,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	highlightSetting,
	type PTBWidgetPluginSettings,
	SettingTab,
} from './settings';
import { mount } from 'svelte';
import { WeightService } from './widgets/weight/WeightService';
import MonthWidget from './widgets/month/MonthWidget.svelte';
import Weight from './widgets/weight/Weight.svelte';
import WeightPill from './widgets/weight/WeightPill.svelte';
import Grid from './widgets/grid/Grid.svelte';
import Timer from './widgets/timer/Timer.svelte';
import Today from './widgets/today/Today.svelte';
import { CalendarService } from './CalendarService';
import { TimerService } from './widgets/timer/TimerService'

export default class PTBWidgetPlugin extends Plugin {
	settings!: PTBWidgetPluginSettings;
	weightService!: WeightService;
	calendarService: CalendarService;

	parseGridProps(source: string, widgets: any): any {
		// Remove "grid" line.
		var newSource = source.substring(source.indexOf('\n') + 1);

		// Split by empty lines
		var widgetOptions = newSource.split(/\r?\n\s*\r?\n/);

		var props = {widgets: []}

		for (let widgetOption of widgetOptions) {
			props.widgets.push(this.parseOptions(widgetOption, widgets))
		}

		return props
	}

	parseOptions(source: string, widgets: any): [any, any] {
		let options = source.split(/\r?\n/)
		let widgetType = options[0]
		options.shift()

		let widget = widgets[widgetType]

		if (widgetType == "grid") {
			let props = this.parseGridProps(source, widgets) 
			return [widget, props]
		}

		let props = widget.props

		for (let option of options) {
			if (option.startsWith("date")) {
				let YMD = option.split(" ")[1]
				if (YMD) {
					props.date = YMD
				}
			}
		}

		return [widget, props]
	}

	async onload() {
		await this.loadSettings();

		this.weightService = new WeightService(this.app, this.settings);
		this.calendarService = new CalendarService(this.app, this.settings)
		this.timerService = new TimerService(this.app, this.settings)

		const WIDGETS = {
			"weight": {
				"props": {
					service: this.weightService,
				},
				"element": Weight
			},
			"weight-pill": {
				"props": {
					service: this.weightService,
				},
				"element": WeightPill
			},
			"month": {
				"props": {
					service: this.calendarService,
				},
				"element": MonthWidget
			},
			"grid": {
				"props": {},
				"element": Grid
			},
			"timer": {
				"props": {
					service: this.timerService
				},
				"element": Timer
			},
			"today": {
				"props": {},
				"element": Today
			}
		}

		this.registerMarkdownCodeBlockProcessor("ptb-widget", (source, el, ctx) => {
			el.empty();

			let [widget, props] = this.parseOptions(source, WIDGETS)

			mount(widget.element, {
				target: el,
				props: props
			});
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<PTBWidgetPluginSettings>,
		);
		if (
			this.settings.highlightSetting === 'none' &&
			(this.settings.dateSetting === 'gainIsBad' || this.settings.dateSetting === 'lossIsBad')
		) {
			this.settings.highlightSetting = this.settings.dateSetting;
			this.settings.dateSetting = DEFAULT_SETTINGS.dateSetting;
			await this.saveSettings();
		}
		highlightSetting.set(this.settings.highlightSetting);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}