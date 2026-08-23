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
</script>

<div class={`weightDiff ` + color}>
	{#if isUp}
		<ArrowUp />
	{:else}
		<ArrowDown />
	{/if}
	<span class="weightNumber">{Math.abs(diff.diff ?? 0).toFixed(1)} from {diff.date}</span>
</div>