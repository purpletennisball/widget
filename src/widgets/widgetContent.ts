import type { App, MarkdownPostProcessorContext, TFile } from "obsidian";

export interface WidgetContentSection {
	markdownContext: ReturnType<MarkdownPostProcessorContext["getSectionInfo"]>;
	relevantLines: string;
	widgetLines: string[];
	widgetContent: string;
}

export function getWidgetContentSection(
	ctx: MarkdownPostProcessorContext | undefined,
	el: HTMLElement,
	index?: number,
): WidgetContentSection | undefined {
	const markdownContext = ctx?.getSectionInfo(el);

	if (!markdownContext) {
		return undefined;
	}

	const relevantLines = markdownContext.text.split(/\r?\n/).slice(
		markdownContext.lineStart,
		markdownContext.lineEnd + 1,
	).join("\n");

	let strippedContent = relevantLines;
	strippedContent = strippedContent.replace("grid\n", "")
	strippedContent = strippedContent.replace("```widgety\n", "")
	strippedContent = strippedContent.replace("```", "")

	const widgetLines = strippedContent
		.split(/\r?\n\s*\r?\n/)
		.filter((option) => option.trim() !== "");

	let widgetContent: string | undefined;

	if (index !== undefined && index !== null) {
		const updateWidgetContent = widgetLines[index];
		if (updateWidgetContent) {
			widgetContent = updateWidgetContent;
		}
	} else {
		widgetContent = strippedContent;
	}

	if (!widgetContent) {
		return undefined;
	}

	return {
		markdownContext,
		relevantLines,
		widgetLines,
		widgetContent,
	};
}

export async function updateWidgetContent(
	app: App,
	currentFile: TFile,
	ctx: MarkdownPostProcessorContext | undefined,
	el: HTMLElement,
	updateWidget: (widgetContent: string, widgetLines: string[]) => string,
	index?: number,
): Promise<void> {
	const section = getWidgetContentSection(ctx, el, index);
	if (!section) {
		return;
	}

	const { markdownContext, relevantLines, widgetLines, widgetContent } = section;
	if (!markdownContext) {
		return;
	}

	const newWidgetContent = updateWidget(widgetContent, widgetLines);

	let newWidget: string;
	if (index !== undefined && index !== null) {
		const newWidgetLines = [...widgetLines];
		newWidgetLines[index] = newWidgetContent;
		newWidget = "```widgety\ngrid\n" + newWidgetLines.join("\n\n") + "```";
	} else {
		newWidget = relevantLines.replace(widgetContent, newWidgetContent);
	}

	const updatedFileContents = markdownContext.text.replace(relevantLines, newWidget);

	await app.vault.process(currentFile, () => updatedFileContents);
}
