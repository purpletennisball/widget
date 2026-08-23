import { App, TFile } from "obsidian";
import type { PTBWidgetPluginSettings } from "../../settings";

export enum WeightDiffDate {
	Yesterday = "yesterday",
	LastWeek = "last week",
}

export interface WeightLog {
	file: TFile;
	weight: number;
	ctime: number;
}

export interface WeightDiff {
	date: WeightDiffDate;
	weightLog: WeightLog | undefined;
	diff: number | undefined;
}

export class WeightService {
	constructor(private app: App, private settings: PTBWidgetPluginSettings) {}

	getWeightForDate(date: Date): WeightLog | undefined {
		const weightHistory: WeightLog[] = this.getWeightHistory();
		date.setHours(23, 59, 59, 0);

		return weightHistory.filter(log => log.ctime <= date.getTime())[0];
	}

	getWeightDiffs(date: Date): WeightDiff[] {
		const weightForDate = this.getWeightForDate(date);
		const weightForYesterday = this.getWeightForYesterdayFromDate(date);
		const weightForLastWeek = this.getWeightForLastWeekFromDate(date);

		let diffs: WeightDiff[] = []

		if (!weightForDate) {
			return []
		}

		if (weightForDate?.ctime !== weightForYesterday?.ctime && weightForYesterday) {
			diffs.push({
				date: WeightDiffDate.Yesterday,
				weightLog: weightForYesterday,
				diff: weightForDate && weightForYesterday ? weightForDate.weight - weightForYesterday.weight : undefined,
			});
		}

		if (weightForDate?.ctime !== weightForLastWeek?.ctime && weightForLastWeek) {
			diffs.push({
				date: WeightDiffDate.LastWeek,
				weightLog: weightForLastWeek,
				diff: weightForDate && weightForLastWeek ? weightForDate.weight - weightForLastWeek.weight : undefined,
			});
		}

		return diffs;
	}

	getWeightForYesterdayFromDate(date: Date): WeightLog | undefined {
		const yesterday = new Date(date);
		yesterday.setHours(23, 59, 59, 0);
		yesterday.setDate(yesterday.getDate() - 1);
		return this.getWeightForDate(yesterday);
	}

	getWeightForLastWeekFromDate(date: Date): WeightLog | undefined {
		const lastWeek = new Date(date);
		lastWeek.setHours(23, 59, 59, 0);
		lastWeek.setDate(lastWeek.getDate() - 7);
		return this.getWeightForDate(lastWeek);
	}

	getLatestWeight(): WeightLog | undefined {
		const weightHistory: WeightLog[] = this.getWeightHistory();
		return weightHistory[0]; 
	}

	formatYMD(dateString: string): Date {
		const [year, month, day] = dateString.split('-').map(Number) as [number, number, number];

		let date = new Date(year, month - 1, day);
		date.setHours(23, 59, 59, 0);
		return date;
	}

	getFileCTime(file: TFile): number {
		if (this.settings.dateSetting === 'custom-property') {
			let dateValue = this.app.metadataCache.getFileCache(file)?.frontmatter?.[this.settings.dateProperty];

			if (dateValue) {
				return this.formatYMD(dateValue).getTime();
			}
		}
		let date = new Date(file.stat.ctime);
		date.setHours(23, 59, 59, 0);
		return date.getTime();
	}

	/**
	 * Get every note containing a weight log.
	 * Results are sorted by date in descending order.
	 * 
	 * @returns WeightLog[]
	 */
	getWeightHistory(): WeightLog[] {
		const rawWeights = this.app.vault.getMarkdownFiles()
			.map(file => ({
				file,
				weight: this.app.metadataCache.getFileCache(file)?.frontmatter?.weight
			}))
			.filter(note => note.weight !== undefined);

		const weightLogs: WeightLog[] = rawWeights.map(note => ({
			file: note.file,
			weight: note.weight,
			ctime: this.getFileCTime(note.file),
		}));

		return weightLogs.sort((a, b) => b.ctime - a.ctime);
	}
}