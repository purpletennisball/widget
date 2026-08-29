<script lang="ts">
	import type { TFile } from "obsidian";
	import type { CounterService, CounterFetch } from "./CounterService";
	import { Plus, Minus } from "lucide-svelte"
	import NumberFlow from '@number-flow/svelte'	

	interface Props {
		service: CounterService;
		id: string;
		title: string;
		idType: string;
		currentFile: TFile;
  	}

	let { service, title, id, idType, currentFile }: Props = $props();

	let counterType = $derived(
		idType === "global" || idType === "prop" ? idType : "prop"
	);

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
	<div class="counterDetails">
	<span class="countTitle">{displayTitle}</span>
	<NumberFlow class="count" value={value}/>
	</div>
	<div class="counterActions">
		<button class="counterIncrementAction" onclick={inc}>
			<Plus/>
		</button>
		<button class="counterDeincrementAction" onclick={deinc}>
			<Minus/>
		</button>
	</div>
</div>