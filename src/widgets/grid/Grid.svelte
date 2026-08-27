<script lang="ts">

	interface Props {
		widgets: any
  	}

	let { widgets }: Props = $props();

	</script>

<div class="ptbWidget ptbGridWidget">
{#each widgets as widget}
	{@const Component = widget[0].element}

	<Component {...widget[1]} />
{/each}
</div>