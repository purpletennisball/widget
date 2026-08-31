<script lang="ts">
	import type { App, MarkdownPostProcessorContext, TFile } from "obsidian";
	import type { CounterService, CounterFetch } from "./CounterService";
	import { Plus, Minus } from "lucide-svelte"
	import NumberFlow from '@number-flow/svelte'
	import CounterOnboard from "./CounterOnboard.svelte";
	import IconButton from "../IconButton.svelte";

	interface Props {
		service: CounterService;
		id: string;
		title: string;
		idType: string;
		currentFile: TFile;
		ctx?: MarkdownPostProcessorContext;
		el: HTMLElement;
		index?: number;
		app: App;
  	}

	let { service, title, id, idType, currentFile, ctx, el, index, app }: Props = $props();

	let counterType = $derived(
		idType === "global" || idType === "prop" ? idType : "prop"
	);

	let needsSetup = $derived(
		!title || !id
	)

	let fetch: CounterFetch = $derived({
		id: id,
		type: counterType,
		file: currentFile
	})

	let value = $state<number>(0);

	$effect(() => {
		void service.getValue(fetch).then((result) => {
			value = result;
		});
	});

	let displayTitle = $derived(title ?? id);

	async function inc() {
		value = await service.increment(fetch);
	}

	async function deinc() {
		value = await service.deincrement(fetch);
	}
</script>

<div class="ptbWidget ptbWidgetShapeBasic ptbCounter">
	{#if needsSetup}
		<CounterOnboard ctx={ctx} el={el} index={index} app={app} currentFile={currentFile}/>
	{:else}
	<div class="counterDetails">
	<span class="countTitle">{displayTitle}</span>
	<NumberFlow class="count" value={value}/>
	</div>
	<div class="counterActions">
		<IconButton onclick={inc} flexGrowing={true}><Plus /></IconButton>
		<IconButton onclick={deinc} variant="secondary" flexGrowing={true}><Minus /></IconButton>
	</div>
	{/if}
</div>