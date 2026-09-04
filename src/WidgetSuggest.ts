import {
	App,
	Editor,
	FuzzySuggestModal,
} from "obsidian";
import type PTBWidgetPlugin from "./main";
import type { Widget } from "./main";

export class WidgetSuggestModal extends FuzzySuggestModal<Widget> {
	constructor(
		private editor: Editor,
		private plugin: PTBWidgetPlugin
	) {
		super(plugin.app);
	}

	getItems(): Widget[] {
		return Object.values(this.plugin.WIDGETS);
	}

	getItemText(item: Widget): string {
		return item.displayName;
	}

	onChooseItem(item: Widget): void {
		let content = `\n\`\`\`widgety\n${item.id}\n\`\`\`\n`;

		this.editor.replaceRange(
			content,
			this.editor.getCursor()
		);
	}
}