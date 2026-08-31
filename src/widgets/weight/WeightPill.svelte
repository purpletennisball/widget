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

	let diffs = $derived(service.getWeightDiffs(materialDate))
</script>

<div class="ptbWidget ptbWeightPill">
	<WeightIcon/>
	<div class="weightData">
		{#if !weight}
			<NoWeight date={date} />
		{:else}
			<div class="weightValue">
				<span class="miniWeight">{weight.oppositeText(service.preferredWeightUnit)}</span>
				<span class="weight">{weight.preferredText(service.preferredWeightUnit)}</span>
			</div>
		{/if}
		{#each diffs as diff}
			<WeightDifferenceView diff={diff} pilled={true} />
		{/each}
	</div>
</div>