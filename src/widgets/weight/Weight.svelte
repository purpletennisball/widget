<script lang="ts">
	import Title from "../Title.svelte";
	import NoWeight from "./NoWeight.svelte";
	import WeightDifferenceView from "./WeightDifferenceView.svelte";
	import WeightIcon from "./WeightIcon.svelte";
	import { type WeightService } from "./WeightService";

	interface Props {
		service: WeightService;
		date: string;
  	}


	let { service, date }: Props = $props();

	var mateialDate: Date;
	var subtitle: string | undefined = undefined
	if (date) {
		mateialDate = service.formatYMD(date)
		subtitle = `for ${date}`
	} else {
		mateialDate = new Date()
	}

	let weight = service.getWeightForDate(mateialDate)?.weight
	let weightUnit = "lbs"; // CHANGE THIS

	let diffs = service.getWeightDiffs(mateialDate);
</script>

<div class="ptbWidget ptbWidgetShapeBasic ptbWeight ptbWidgetsWidgetFrame">
	<div class="iconAndTitle">
	<WeightIcon/>
	<Title title="Weight" subtitle={subtitle} />
	</div>
	<div class="weightData">
		{#if !weight}
			<span class="weight">
				<NoWeight date={date} />
			</span>
		{:else}
			<span class="weight">{weight}{weightUnit}</span>
		{/if}
		{#each diffs as diff}
			<WeightDifferenceView diff={diff} />
		{/each}
	</div>
</div>