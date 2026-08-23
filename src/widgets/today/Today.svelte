<script lang="ts">
	let date = new Date()
	let today = date.getDate()
	const weekday = date.toLocaleDateString(undefined, {weekday: 'short'});
	const month = date.toLocaleDateString(undefined, {month: 'short'});
</script>

<div class="ptbWidget ptbWidgetShapeBasic ptbToday">
	<div class="todayDetails">
		<span class="todayWeekday">{weekday}</span>
		<span class="todayMonth">{month}</span>
	</div>
	<span class="todayNumber">
		{today}
	</span>
</div>