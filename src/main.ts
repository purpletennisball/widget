import {
	Editor,
	MarkdownView,
	Plugin,
	type MarkdownFileInfo,
	type MarkdownPostProcessorContext,
	type TFile,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	highlightSetting,
	type PTBWidgetPluginSettings,
	SettingTab,
} from './settings';
import { mount, type Component } from 'svelte';
import { WeightService } from './widgets/weight/WeightService';
import MonthWidget from './widgets/month/MonthWidget.svelte';
import Weight from './widgets/weight/Weight.svelte';
import Grid from './widgets/grid/Grid.svelte';
import Today from './widgets/today/Today.svelte';
import { CalendarService } from './CalendarService';
import { TimerService } from './widgets/timer/TimerService'
import { CounterService } from './widgets/counter/CounterService';
import Counter from './widgets/counter/Counter.svelte';
import Clock from './widgets/clock/Clock.svelte';
import { updateWidgetContent as updateWidgetContentInFile } from './widgets/widgetContent';
import { WidgetSuggestModal } from './WidgetSuggest';

export interface Widget {
	props: { [key: string]: unknown }
	element: Component<Record<string, unknown>>
	displayName: string
	id: string
}

class InvalidWidgetError extends Error {
	constructor(message: string, public field?: string) {
		super(message);
		this.name = 'InvalidWidgetError';
		Object.setPrototypeOf(this, InvalidWidgetError.prototype);
	}
}

export enum WidgetSize {
	Pill = "pill",
	Small = "small",
	Medium = "medium",
	Tall = "tall",
	Large = "large",
}

export default class PTBWidgetPlugin extends Plugin {
	settings!: PTBWidgetPluginSettings;
	public weightService!: WeightService;
	public calendarService!: CalendarService;
	public timerService!: TimerService;
	public counterService!: CounterService;

	public get WIDGETS(): { [key: string]: Widget } { return {
		"weight": {
			"props": {
				service: this.weightService,
				pilled: false
			},
			"element": Weight,
			"displayName": "Weight",
			"id": "weight"
		},
		"weight-pill": {
			"props": {
				service: this.weightService,
				pilled: true
			},
			"element": Weight,
			"displayName": "Weight (Pill)",
			id: "weight-pill"
		},
		"month": {
			"props": {
				service: this.calendarService,
			},
			"element": MonthWidget,
			"displayName": "Month",
			id: "month"
		},
		"grid": {
			"props": {},
			"element": Grid,
			"displayName": "Grid",
			id: "grid"
		},
		/*"timer": {
			"props": {
				service: this.timerService
			},
			"element": Timer
		},*/
		"today": {
			"props": {},
			"element": Today,
			"displayName": "Today",
			id: "today"
		},
		"counter": {
			"props": {
				service: this.counterService,
				app: this.app
			},
			"element": Counter,
			"displayName": "Counter",
			id: "counter"
		},
		"clock": {
			"props": {},
			"element": Clock,
			"displayName": "Clock",
			id: "clock"
		}
	}}

	public async updateWidgetContent(
		currentFile: TFile,
		ctx: MarkdownPostProcessorContext | undefined,
		el: HTMLElement,
		updateWidget: (widgetContent: string, widgetLines: string[]) => string,
		index?: number,
	): Promise<void> {
		await updateWidgetContentInFile(this.app, currentFile, ctx, el, updateWidget, index);
	}

	parseGridProps(source: string): { [key: string]: unknown } {
		// Remove "grid" line.
		let newSource = source.substring(source.indexOf('\n') + 1);

		// Split by empty lines and filter out empty options
		let widgetOptions = newSource.split(/\r?\n\s*\r?\n/).filter(option => option.trim() !== '');

		let props: { widgets: [Widget, { [key: string]: unknown }][] } = { widgets: [] }

		for (let widgetOption of widgetOptions) {
			props.widgets.push(this.parseOptions(widgetOption))
		}

		return props
	}

	parseOptions(source: string): [Widget, { [key: string]: unknown }] {
		let options = source.split(/\r?\n/)
		let widgetType = options[0]
		options.shift()

		let widget = this.WIDGETS[widgetType ?? "unknown"]

		if (!widget) {
			throw new InvalidWidgetError(`${widgetType} is not a valid widget`)
		}

		if (widgetType == "grid") {
			let props = this.parseGridProps(source) 
			return [widget, props]
		}

		let props = { ...widget.props }

		for (let option of options) {
			let optionName = option.split(" ")[0]
			let optionValue = option.replace(`${optionName} `, "")
			if (optionName) {
				props[optionName] = optionValue
			}
		}

		return [widget, props]
	}

	async onload() {
		await this.loadSettings();

		this.weightService = new WeightService(this.app, this.settings);
		this.calendarService = new CalendarService(this.app, this.settings)
		this.timerService = new TimerService(this.app, this.settings)
		this.counterService = new CounterService(this)

		this.registerMarkdownCodeBlockProcessor("widgety", (
			source,
			el: HTMLElement, 
			ctx: MarkdownPostProcessorContext
		) => {
			el.empty();

			const currentFile = this.app.vault.getFileByPath(ctx.sourcePath);

			let [widget, props] = this.parseOptions(source)

			props.currentFile = currentFile
			props.ctx = ctx
			props.el = el

			mount(widget.element, {
				target: el,
				props: props
			});
		});

		this.addCommand({
			id: "insert-widgety",
			name: "Insert widget",
			editorCallback: (editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => {
				new WidgetSuggestModal(editor, this).open();
			},
		});

		this.addRibbonIcon("square-plus", "Insert widget", (evt: MouseEvent) => {
			const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (activeView) {
				new WidgetSuggestModal(activeView.editor, this).open();
			}
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

