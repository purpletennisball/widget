<script lang="ts">
	import { CalendarService } from "../../CalendarService";
	import NoWeight from "./NoWeight.svelte";
	import WeightDifferenceView from './WeightDifferenceView.svelte'
	import WeightIcon from "./WeightIcon.svelte";
	import { type WeightService } from "./WeightService";

	interface Props {
		service: WeightService;
		date: string;
  	}
	
	let { service, date }: Props = $props();

	let materialDate = $derived(date ? CalendarService.formatYMD(date) : new Date())

	let weight = $derived(service.getWeightForDate(materialDate)?.weight)
	let weightUnit = "lbs"; // CHANGE THIS

	let diffs = $derived(service.getWeightDiffs(materialDate))
</script>

<div class="ptbWidget ptbWeightPill">
	<WeightIcon/>
	<div class="weightData">
		{#if !weight}
			<NoWeight date={date} />
		{:else}
			<span class="weight">{weight}{weightUnit}</span>
		{/if}
		{#each diffs as diff}
			<WeightDifferenceView diff={diff} pilled={true} />
		{/each}
	</div>
</div>