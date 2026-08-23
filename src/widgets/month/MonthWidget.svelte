<script lang="ts">
	import type { CalendarService } from "../../CalendarService";

	interface Props {
		service: CalendarService;
  	}

	let { service }: Props = $props();

	let date = new Date()
	let days = service.getDaysInMonthByDate(date)
	var gridItems: string[] = []
	var today: string = date.getDate().toString()
	const fullMonth = date.toLocaleString('default', { month: 'long' });


	for (let i = 0; i != date.getDay()+1; i++) {
  		gridItems.push("")
	}

	for (let i = 0; i != days; i++) {
  		gridItems.push((i+1).toString())
	}
</script>

<div class="ptbWidget ptbWidgetShapeBasic ptbMonth">
	<span class="monthTitle">{fullMonth}</span>
	<div class="weekdays">
		<span>S</span>
		<span>M</span>
		<span>T</span>
		<span>W</span>
		<span>T</span>
		<span>F</span>
		<span>S</span>
	</div>
	<div class="calendarGrid">
		{#each gridItems as gridItem}
			<span class={["calendarItem", today == gridItem && "today"]}>{gridItem}</span>
		{/each}
	</div>
</div>