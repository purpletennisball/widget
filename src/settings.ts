import { App, PluginSettingTab, type SettingDefinitionItem } from 'obsidian';
import { writable } from 'svelte/store';
import PTBWidgetPlugin from './main';

export interface PTBWidgetPluginSettings {
	dateSetting: string;
	dateProperty: string;
	highlightSetting: string;
	preferredWeightUnit: string;
}

export const DEFAULT_SETTINGS: PTBWidgetPluginSettings = {
	dateSetting: 'creation',
	dateProperty: 'date',
	highlightSetting: 'none',
	preferredWeightUnit: 'lbs'
};

export const highlightSetting = writable(DEFAULT_SETTINGS.highlightSetting);

export class SettingTab extends PluginSettingTab {
	plugin: PTBWidgetPlugin;

	constructor(app: App, plugin: PTBWidgetPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				type: 'group',
				heading: 'Weight',
				items: [
					{
						name: 'Date',
						desc: 'Where to get the date from. Defaults to the creation date of the note.',
						control: {
							type: 'dropdown',
							key: 'dateSetting',
							options: {
								creation: 'Creation date',
								'custom-property': 'Custom property',
							},
						},
					},
					{
						name: 'Date property',
						desc: 'The custom property to use for the date.',
						control: {
							type: 'text',
							key: 'dateProperty',
							placeholder: 'Enter the date property name',
						},
					},
					{
						name: 'Highlight gains/losses',
						desc: 'Highlight colors for gains or losses.',
						control: {
							type: 'dropdown',
							key: 'highlightSetting',
							options: {
								gainIsBad: 'Gain is red, loss is green',
								lossIsBad: 'Gain is green, loss is red',
								none: 'No highlighting',
							},
						},
					},
					{
						name: 'Preferred weight unit',
						desc: 'Use kilograms or pounds.',
						control: {
							type: 'dropdown',
							key: 'preferredWeightUnit',
							options: {
								lbs: 'lbs',
								kg: 'kg',
							},
						},
					},
				],
			},
		];
	}
}
