import {
	App,
	Editor,
	FuzzySuggestModal,
} from "obsidian";
import type PTBWidgetPlugin from "./main";

interface WidgetOption {
	name: string;
}

export class WidgetSuggestModal extends FuzzySuggestModal<WidgetOption> {
	constructor(
		private editor: Editor,
		private plugin: PTBWidgetPlugin
	) {
		super(plugin.app);
	}

	getItems(): WidgetOption[] {
		return Array.from(Object.keys(this.plugin.WIDGETS)).map((widgetName) => ({
			name: widgetName,
		}));
	}

	getItemText(item: WidgetOption): string {
		return item.name;
	}

	onChooseItem(item: WidgetOption): void {
		let content = `\n\`\`\`widgety\n${item.name}\n\`\`\`\n`;

		this.editor.replaceRange(
			content,
			this.editor.getCursor()
		);
	}
}