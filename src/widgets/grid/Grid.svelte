<script lang="ts">
	import type { MarkdownPostProcessorContext, TFile } from "obsidian";

	interface Props {
		widgets: any;
		currentFile: TFile;
		ctx: MarkdownPostProcessorContext;
		el: HTMLElement;
  	}

	let { widgets, currentFile, ctx, el }: Props = $props();

	</script>

<div class="ptbWidget ptbGridWidget">
{#each widgets as widget, index}
	{@const Component = widget[0].element}

	<Component {...widget[1]} {currentFile} {ctx} {el} {index} />
{/each}
</div>