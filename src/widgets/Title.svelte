<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
	}

	let { title, subtitle }: Props = $props();
</script>

<div class="titleContainer">
{#if subtitle}
	<span class="title">{title}</span>
	<span class="subtitle">{subtitle}</span>
{:else}
	<span class="title">{title}</span>
{/if}
</div>