<script lang="ts">
	import { CalendarService } from "../../CalendarService";
	import Title from "../Title.svelte";
	import NoWeight from "./NoWeight.svelte";
	import WeightDifferenceView from "./WeightDifferenceView.svelte";
	import WeightIcon from "./WeightIcon.svelte";
	import { type WeightService } from "./WeightService";

	interface Props {
		service: WeightService;
		date: string;
		pilled: boolean
  	}

	let { service, date, pilled }: Props = $props();

	let materialDate = $derived(date ? CalendarService.formatYMD(date) : new Date())
	let subtitle = $derived(date ? `for ${date}` : undefined)

	let weight = $derived(service.getWeightForDate(materialDate)?.weight)

	let diffs = $derived(service.getWeightDiffs(materialDate))

</script>

{#if pilled}
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
{:else}
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
			<div class="weightValue">
				<span class="miniWeight">{weight.oppositeText(service.preferredWeightUnit)}</span>
				<span class="weight">{weight.preferredText(service.preferredWeightUnit)}</span>
			</div>
		{/if}
		{#each diffs as diff}
			<WeightDifferenceView diff={diff} pilled={false} />
		{/each}
	</div>
</div>
{/if}