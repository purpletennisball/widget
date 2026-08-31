<script lang="ts">
	import { ArrowRight, Check } from "lucide-svelte"
	import OnboardTabs from "../OnboardTabs.svelte";
	import Title from "../Title.svelte";
	import SelectionBox from "../SelectionBox.svelte";
	import type { App, MarkdownPostProcessorContext, TFile } from "obsidian";

	interface Props {
		ctx?: MarkdownPostProcessorContext;
		el: HTMLElement;
		index?: number;
		app: App;
		currentFile: TFile;
  	}

	let { ctx, el, index, app, currentFile }: Props = $props();

	let currentTab = $state(1)

	var counterName = $state('My Counter');
	var counterID = $state('counter');
	var counterType = $state('prop');

	function nextTab() {
		if (currentTab == 1) {
			counterID = 
				counterName
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-+|-+$/g, "");
		}
		currentTab++
	}

	async function finish() {
		const markdownContext = ctx?.getSectionInfo(el)

		if (!markdownContext) {
			// show error
			return
		}

		var relevantLines = markdownContext.text.split(/\r?\n/).slice(
			markdownContext.lineStart,
			markdownContext.lineEnd + 1
		).join('\n');

		var strippedContent = relevantLines;

		strippedContent = strippedContent.replace("grid\n", "")
		strippedContent = strippedContent.replace("```widgety\n", "")
		strippedContent = strippedContent.replace("```", "")

		// Split by empty lines and filter out empty options
		let widgetLines = strippedContent.split(/\r?\n\s*\r?\n/).filter(option => option.trim() !== '');


		var widgetContent: string | undefined = undefined
		if (index) {
			let updateWidgetContent = widgetLines[index]
			if (updateWidgetContent) {
				widgetContent = updateWidgetContent
			}
		} else {
			widgetContent = strippedContent
		}

		if (!widgetContent) {
			return
		}

		let newWidgetContent = widgetContent + `title ${counterName}\nid ${counterID}\nidType ${counterType}\n`

		var newWidget: string;
		if (index) {
			let newWidgetLines = widgetLines
			newWidgetLines[index] = newWidgetContent
			newWidget = "```widgety\ngrid\n" + widgetLines.join("\n\n") + "```"
		} else {
			newWidget = relevantLines.replace(widgetContent, newWidgetContent)
		}

		let updatedFileContents = markdownContext.text.replace(relevantLines, newWidget)

		await app.vault.process(currentFile, (content) => {
			return updatedFileContents
		});
	}

	function calcTabClasses(id: number): string[] {
		var classes = ["tab"]

		if (id == currentTab) {
			classes.push("currentTab")
		}

		if (id == currentTab-1) {
			classes.push("prevTab")
		}
		
		if (id == currentTab+1) {
			classes.push("nextTab")
		}

		return classes
	}
</script>

<div class="counterOnboard">
	<OnboardTabs tabs={3} currentTab={currentTab} />

	<div class="tabContainer">
		<div class={calcTabClasses(1)}>
			<div class="tabContent">
			<Title title="Title" subtitle="What will you call this counter?" />
			</div>
			<div class="bottomToolbar">
				<input type="text" name="Counter Name" bind:value={counterName} class="flexGrow1 widgetyInput">
				<button onclick={nextTab} class="widgetyButton"><ArrowRight /></button>
			</div>
		</div>

		<div class={calcTabClasses(2)}>
			<div class="tabContent">
			<Title title="ID" subtitle="Now give it an ID. We added a recommended one." />
			</div>
			<div class="bottomToolbar">
				<input type="text" name="Counter ID" bind:value={counterID} class="flexGrow1 widgetyInput">
				<button onclick={nextTab} class="widgetyButton"><ArrowRight /></button>
			</div>
		</div>

		<div class={calcTabClasses(3)}>
			<div class="tabContent">
			<Title title="Scope" />
			<div class="selectionBoxes">
			<SelectionBox bind:value={counterType} key={"prop"}>
				<Title title="Property" subtitle="Saves data in the file properties." />
			</SelectionBox>
			<SelectionBox bind:value={counterType} key={"global"}>
				<Title title="Global" subtitle="Saves data in the plugin file. Keeps value the same across notes." />
			</SelectionBox>
			</div>
			<div class="toolbarSpacer"></div>
			</div>
			<div class="bottomToolbar">
				<button onclick={finish} class="widgetyButton"><Check /></button>
			</div>
		</div>
	</div>
</div>