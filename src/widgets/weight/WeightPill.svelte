<script lang="ts">
	import NoWeight from "./NoWeight.svelte";
	import WeightDifferencePill from "./WeightDifferencePill.svelte";
	import WeightIcon from "./WeightIcon.svelte";
	import { type WeightService } from "./WeightService";

	interface Props {
		service: WeightService;
		date: string;
  	}
	

	let { service, date }: Props = $props();

	var mateialDate: Date;
	if (date) {
		mateialDate = service.formatYMD(date)
	} else {
		mateialDate = new Date()
	}

	let weight = service.getWeightForDate(mateialDate)?.weight
	let weightUnit = "lbs"; // CHANGE THIS

	let diffs = service.getWeightDiffs(mateialDate);
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
			<WeightDifferencePill diff={diff} />
		{/each}
	</div>
</div>