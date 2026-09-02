<script lang="ts">
	import type { App, MarkdownPostProcessorContext, TFile } from "obsidian";
	import type { CounterService, CounterFetch } from "./CounterService";
	import { Plus, Minus, Settings, X, Check } from "lucide-svelte"
	import NumberFlow from '@number-flow/svelte'
	import CounterOnboard from "./CounterOnboard.svelte";
	import IconButton from "../IconButton.svelte";
	import Modal from "../Modal.svelte";
	import Title from "../Title.svelte";
	import { updateWidgetContent as updateWidgetContentInFile } from "../widgetContent";
	import CounterScopeSelection from "./CounterScopeSelection.svelte";
	import Widget from "../Widget.svelte";

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
		theme: 'accent' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'light-blue' | 'blue' | 'purple' | 'pink' | 'magenta';
		size?: 'small' | 'medium';
  	}

	let { service, title, id, idType, currentFile, ctx, el, index, app, theme, size = 'small' }: Props = $props();

	let counterType = $derived(
		idType === "global" || idType === "prop" ? idType : "prop"
	);

	let needsSetup = $derived(
		!title || !id
	)

	let accent = $derived(
		theme !== undefined ? theme : "accent"
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

	let showSettings = $state(false);

	function toggleSettingsPanel() {
		showSettings = !showSettings;
	}

	async function updateSettings() {
		await updateWidgetContentInFile(
			app,
			currentFile,
			ctx,
			el,
			(widgetContent) => `counter\ntitle ${counterName}\nid ${counterID}\nidType ${counterIDType}\ntheme ${accent}\nsize ${size}\n`,
			index,
		);

		toggleSettingsPanel();
	}

	let counterName = $derived(title);
	let counterID = $derived(id);
	let counterIDType = $derived(idType);
</script>

<Widget size={size} id="Counter" class={`accentOverride-${accent}`}>
	<div class="overlayTopBar">
		<div class="flexGrow1"></div>
		<IconButton variant="muted" onclick={toggleSettingsPanel}>
			<Settings/>
		</IconButton>
	</div>
	<Modal bind:showModal={showSettings}>
		<div class="toolbar">
			<IconButton variant="muted" onclick={toggleSettingsPanel}>
				<X/>
			</IconButton>
			<Title title="Counter Settings"/>
			<IconButton onclick={updateSettings}>
				<Check/>
			</IconButton>
		</div>
		<div class="modalContent">
			<div class="settingRow">
				<span class="settingLabel">Title</span>
				<input type="text" bind:value={counterName} class="widgetyInput"/>
			</div>
			<div class="settingRow">
				<span class="settingLabel">ID</span>
				<input type="text" bind:value={counterID} class="widgetyInput"/>
			</div>
			<div class="settingRow">
				<span class="settingLabel">Scope</span>
				<div class="flex flexColumn gap8">
					<CounterScopeSelection bind:value={counterIDType} />
				</div>
			</div>
		</div>
	</Modal>
	{#if needsSetup}
		<CounterOnboard ctx={ctx} el={el} index={index} app={app} currentFile={currentFile}/>
	{:else}
	<div class="counterDetails">
	<span class="countTitle">{displayTitle}</span>
	<NumberFlow class="count" value={value}/>
	</div>
	<div class="counterActions">
		<IconButton onclick={inc} flexGrowing shapeMorphing><Plus /></IconButton>
		<IconButton onclick={deinc} variant="secondary" flexGrowing shapeMorphing><Minus /></IconButton>
	</div>
	{/if}
</Widget>