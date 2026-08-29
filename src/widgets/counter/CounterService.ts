import type { TFile } from "obsidian";
import type PTBWidgetPlugin from "../../main";

export interface CounterFetch {
	id: string;
	type: string;
	file: TFile;
}

export class CounterService {
	constructor(private plugin: PTBWidgetPlugin) {}

	async getValue(fetch: CounterFetch): Promise<number> {
		switch (fetch.type) {
			case "prop": {
				let file = this.plugin.app.metadataCache.getFileCache(fetch.file)
				let val = file?.frontmatter?.[fetch.id] as number;
				return val ?? 0
			}
			case "global": {
				let data = await this.plugin.loadData() as { [key: string]: unknown }
				return data[`counter${fetch.id}`] as number ?? 0
			}
		}

		return 0
	}

	async setValue(fetch: CounterFetch, value: number) {
		switch (fetch.type) {
			case "prop": {
				await this.plugin.app.fileManager.processFrontMatter(fetch.file, (frontmatter: { [key: string]: unknown }) => {
					frontmatter[fetch.id] = value;
				});
				break;
			}
			case "global": {
				let data = await this.plugin.loadData() as { [key: string]: unknown }
				data[`counter${fetch.id}`] = value
				await this.plugin.saveData(data)
				break;
			}
		}
	}

	async changeValue(fetch: CounterFetch, change: number): Promise<number> {
		let newValue = await this.getValue(fetch) + change
		await this.setValue(fetch, newValue)
		return newValue
	}

	async increment(fetch: CounterFetch): Promise<number> {
		return this.changeValue(fetch, 1)
	}

	async deincrement(fetch: CounterFetch): Promise<number> {
		return this.changeValue(fetch, -1)
	}
}