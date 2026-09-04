<script lang="ts">
	import { ArrowUp, ArrowDown } from 'lucide-svelte';
	import { type WeightDiff } from "./WeightService";
	import { highlightSetting } from "../../settings";

	interface Props {
		diff: WeightDiff;
		pilled: boolean;
  	}

	let { diff, pilled }: Props = $props();
	let isUp = $derived((diff.diff ?? 0) > 0);
	let color = $derived.by(() => {
		if ($highlightSetting === 'gainIsBad') {
			return isUp ? 'accentOverride-red' : 'accentOverride-green';
		}
		if ($highlightSetting === 'lossIsBad') {
			return isUp ? 'accentOverride-green' : 'accentOverride-red';
		}
		return '';
	});

	let shorthands = {"last week": "LW", "yesterday": "Y"}
</script>

{#if pilled}
<div class="weightDiffPillWrapper">
<span class="weightDiffText">{shorthands[diff.date]}</span>
<div class={`weightDiffPill ` + color}>
	{#if isUp}
		<ArrowUp class="weightDiffPillArrow"/>
	{:else}
		<ArrowDown class="weightDiffPillArrow"/>
	{/if}
	<span class="weightNumber">{Math.abs(diff.diff ?? 0).toFixed(1)}</span>
</div>
</div>
{:else}
<div class={`weightDiff ` + color}>
	{#if isUp}
		<ArrowUp />
	{:else}
		<ArrowDown />
	{/if}
	<span class="weightNumber">{Math.abs(diff.diff ?? 0).toFixed(1)} from {diff.date}</span>
</div>
{/if}