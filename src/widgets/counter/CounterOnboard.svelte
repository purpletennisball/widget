<script lang="ts">
	import { ArrowRight, Check } from "lucide-svelte"
	import OnboardTabs from "../OnboardTabs.svelte";
	import Title from "../Title.svelte";
	import SelectionBox from "../SelectionBox.svelte";
	import type { App, MarkdownPostProcessorContext, TFile } from "obsidian";
	import IconButton from "../IconButton.svelte";
	import { updateWidgetContent as updateWidgetContentInFile } from "../widgetContent";

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
		await updateWidgetContentInFile(
			app,
			currentFile,
			ctx,
			el,
			(widgetContent) => widgetContent + `title ${counterName}\nid ${counterID}\nidType ${counterType}\n`,
			index,
		);
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
				<IconButton onclick={nextTab}><ArrowRight /></IconButton>
			</div>
		</div>

		<div class={calcTabClasses(2)}>
			<div class="tabContent">
			<Title title="ID" subtitle="Now give it an ID. We added a recommended one." />
			</div>
			<div class="bottomToolbar">
				<input type="text" name="Counter ID" bind:value={counterID} class="flexGrow1 widgetyInput">
				<IconButton onclick={nextTab}><ArrowRight /></IconButton>
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
				<IconButton onclick={finish}><Check /></IconButton>
			</div>
		</div>
	</div>
</div>