<script lang="ts">
	import { ArrowUp, ArrowDown } from 'lucide-svelte';
	import { type WeightDiff } from "./WeightService";
	import { highlightSetting } from "../../settings";

	interface Props {
		diff: WeightDiff;
  	}

	let { diff }: Props = $props();
	let isUp = $derived((diff.diff ?? 0) > 0);
	let color = $derived.by(() => {
		if ($highlightSetting === 'gainIsBad') {
			return isUp ? 'weightBad' : 'weightGood';
		}
		if ($highlightSetting === 'lossIsBad') {
			return isUp ? 'weightGood' : 'weightBad';
		}
		return '';
	});

	let shorthands = {"last week": "LW", "yesterday": "Y"}
</script>

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