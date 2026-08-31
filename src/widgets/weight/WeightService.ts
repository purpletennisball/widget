import { App, TFile } from "obsidian";
import type { PTBWidgetPluginSettings } from "../../settings";
import { CalendarService } from "../../CalendarService";

export enum WeightDiffDate {
	Yesterday = "yesterday",
	LastWeek = "last week",
}

export class WeightUnit {
	pounds: number;
	get kilograms(): number {
		return WeightUnit.poundsToKilograms(this.pounds)
	}

	preferredUnit(unit: string): number {
		switch (unit) {
		case "lbs": {
			return this.pounds
		}
		case "kg": {
			return this.kilograms
		}
		}
		return this.pounds
	}

	get poundsText(): string {
		return `${this.pounds.toFixed(1)}lbs`
	}

	get kilogramsText(): string {
		return `${this.kilograms.toFixed(1)}kg`
	}

	preferredText(unit: string): string {
		switch (unit) {
		case "lbs": {
			return this.poundsText
		}
		case "kg": {
			return this.kilogramsText
		}
		}
		return this.poundsText
	}

	constructor(pounds: number) {
		this.pounds = pounds;
	}

	static pounds(unit: number): WeightUnit {
		return new WeightUnit(unit)
	}

	static kilograms(unit: number): WeightUnit {
		return new WeightUnit(WeightUnit.kilogramsToPounds(unit))
	}

	static preferredUnit(value: number, unit: string): WeightUnit {
		switch (unit) {
		case "lbs": {
			return WeightUnit.pounds(value)
		}
		case "kg": {
			return WeightUnit.kilograms(value)
		}
		}
		return WeightUnit.pounds(value)
	}

	static poundsToKilograms(pounds: number): number {
		return pounds * 0.45359237
	}

	static kilogramsToPounds(kilograms: number): number {
		return kilograms * 2.20462
	}
	
	static diff(left: WeightUnit, right: WeightUnit): WeightUnit {
		return WeightUnit.pounds(left.pounds - right.pounds)
	}

	static oppositeUnit(unit: string): string {
		return unit == "lbs" ? "kg" : "lbs"
	}

	oppositeText(unit: string): string {
		return this.preferredText(WeightUnit.oppositeUnit(unit))
	}
}

export interface WeightLog {
	file: TFile;
	weight: WeightUnit;
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

		const unit = this.preferredWeightUnit

		if (weightForDate?.ctime !== weightForYesterday?.ctime && weightForYesterday) {
			diffs.push({
				date: WeightDiffDate.Yesterday,
				weightLog: weightForYesterday,
				diff: weightForDate && weightForYesterday ? WeightUnit.diff(weightForDate.weight, weightForYesterday.weight).preferredUnit(unit) : undefined,
			});
		}

		if (weightForDate?.ctime !== weightForLastWeek?.ctime && weightForLastWeek) {
			diffs.push({
				date: WeightDiffDate.LastWeek,
				weightLog: weightForLastWeek,
				diff: weightForDate && weightForLastWeek ? WeightUnit.diff(weightForDate.weight, weightForLastWeek.weight).preferredUnit(unit) : undefined,
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

	getFileCTime(file: TFile): number {
		if (this.settings.dateSetting === 'custom-property') {
			let dateValue: unknown = this.app.metadataCache.getFileCache(file)?.frontmatter?.[this.settings.dateProperty];

			if (typeof dateValue === "string") {
				return CalendarService.formatYMD(dateValue).getTime();
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
			.map(file => {
				let rawWeight: unknown = this.app.metadataCache.getFileCache(file)?.frontmatter?.weight
				let weight: number;
				if (typeof rawWeight === "number") {
					weight = rawWeight
				} else if (typeof rawWeight == "string") {
					weight = +rawWeight
				} else {
					weight = 0
				}
				return {file, weight}
			})
			.filter(note => note.weight !== 0);
			
		const weightLogs: WeightLog[] = rawWeights.map(note => ({
			file: note.file,
			weight: WeightUnit.preferredUnit(note.weight, this.preferredWeightUnit),
			ctime: this.getFileCTime(note.file),
		}));

		return weightLogs.sort((a, b) => b.ctime - a.ctime);
	}

	get preferredWeightUnit(): string {
		return this.settings.preferredWeightUnit
	}
}