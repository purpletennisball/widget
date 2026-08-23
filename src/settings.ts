import { App, PluginSettingTab, Setting } from 'obsidian';
import { writable } from 'svelte/store';
import PTBWidgetPlugin from './main';

export interface PTBWidgetPluginSettings {
	dateSetting: string;
	dateProperty: string;
	highlightSetting: string;
}

export const DEFAULT_SETTINGS: PTBWidgetPluginSettings = {
	dateSetting: 'creation',
	dateProperty: 'date',
	highlightSetting: 'none'
};

export const highlightSetting = writable(DEFAULT_SETTINGS.highlightSetting);

export class SettingTab extends PluginSettingTab {
	plugin: PTBWidgetPlugin;

	constructor(app: App, plugin: PTBWidgetPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
            .setName('Weight Widget')
            .setHeading();

		new Setting(containerEl)
			.setName('Date')
			.setDesc("Where to get the date from. Defaults to the creation date of the note.")
			.addDropdown((dropdown) => {
				dropdown.addOption('creation', 'Creation Date');
				dropdown.addOption('custom-property', 'Custom Property');
				dropdown.setValue(this.plugin.settings.dateSetting);
				dropdown.onChange(async (value) => {
					this.plugin.settings.dateSetting = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Date Property')
			.setDesc("The custom property to use for the date.")
			.addText((text) => {
				text.setPlaceholder('Enter the date property name');
				text.setValue(this.plugin.settings.dateProperty);
				text.onChange(async (value) => {
					this.plugin.settings.dateProperty = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Highlight Gains/Losses')
			.setDesc("Highlight colors for gains or losses.")
			.addDropdown((dropdown) => {
				dropdown.addOption('gainIsBad', 'Gain is Red, Loss is Green');
				dropdown.addOption('lossIsBad', 'Gain is Green, Loss is Red');
				dropdown.addOption('none', 'No Highlighting');
				dropdown.setValue(this.plugin.settings.highlightSetting);
				dropdown.onChange(async (value) => {
					this.plugin.settings.highlightSetting = value;
					highlightSetting.set(value);
					await this.plugin.saveSettings();
				});
			});
	}
}
