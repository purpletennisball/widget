<script lang="ts">
	import type { Snippet } from "svelte";
	import { WidgetSize } from "../main";

	interface Props {
		children?: Snippet;
		size: WidgetSize;
		id: string;
		class?: string;
	}

	let { children, size = WidgetSize.Small, id, class: className } = $props();
</script>

<div class={['ptbWidget', `widgety-${size}`, `widgety-${id}`, className]}>
	{@render children?.()}
</div>