<script lang="ts">
	import type { TFile } from "obsidian";


	interface Props {
		widgets: any;
		currentFile: TFile;
  	}

	let { widgets, currentFile }: Props = $props();

	</script>

<div class="ptbWidget ptbGridWidget">
{#each widgets as widget}
	{@const Component = widget[0].element}

	<Component {...widget[1]} {currentFile} />
{/each}
</div>