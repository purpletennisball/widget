<script lang="ts">
	import { CalendarService } from "../../CalendarService";

	interface Props {
		service: CalendarService;
		date: string;
  	}

	let { service, date }: Props = $props();

	var dateFormatted: Date = $derived(
		date ? CalendarService.formatYMD(date) : new Date()
	)

	let days = $derived(service.getDaysInMonthByDate(dateFormatted))
	let gridItems = $derived.by(() => {
		const items: string[] = []
		for (let i = 0; i != dateFormatted.getDay()+1; i++) {
  			items.push("")
		}
		for (let i = 0; i != days; i++) {
  			items.push((i+1).toString())
		}
		return items
	})
	var today: string = $derived(dateFormatted.getDate().toString())
	const fullMonth = $derived(dateFormatted.toLocaleString('default', { month: 'long' }));
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