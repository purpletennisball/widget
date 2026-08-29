<script lang="ts">
	import NumberFlow from '@number-flow/svelte'	
	import { onMount } from 'svelte';

	interface Props {
  	}

	let { }: Props = $props();

	const options: Intl.DateTimeFormatOptions = { 
		weekday: 'long', 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric' 
	};

	let time = $state(new Date());

	let hours = $derived(time.getHours());
	let minutes = $derived(time.getMinutes());
	let seconds = $derived(time.getSeconds());

	let date = $derived(time.toLocaleDateString('en-US', options));

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="ptbWidget ptbWidgetShapeBasic ptbClock">
	<div class="clock">
	<NumberFlow class="count" value={hours} format={{ minimumIntegerDigits: 2 }}/>
	<NumberFlow class="count" prefix=":" value={minutes} format={{ minimumIntegerDigits: 2 }}/>
	<NumberFlow class="count" prefix=":" value={seconds} format={{ minimumIntegerDigits: 2 }}/>
	</div>
	<span class="clockDate">{date}</span>
</div>