<script lang="ts">
	interface Props {
		title: string;
		subtitle: string | undefined;
  	}

	let { title, subtitle }: Props = $props();
</script>

<div class="title">
{#if subtitle}
	<h3>{title}</h3>
	<span class="subtitle">{subtitle}</span>
{:else}
	<h1>{title}</h1>
{/if}
</div>