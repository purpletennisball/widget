<script lang="ts">
	interface Props {
		date: string;
  	}

	let { date }: Props = $props();
</script>

<div class="noWeight">
	No weight records for {date}
</div>