<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
		value: any;
		key: any;
	}

  	let { children, value = $bindable(), key } = $props();

	let isDown = $state(false);
</script>

<button 
	onclick={() => (value = key)}
	class={["selectionBox", value == key && "selectionBoxSelected", isDown && "selectionBoxSelecting"]}
	onmousedown={() => isDown = true}
  	onmouseup={() => isDown = false}
  	onmouseleave={() => isDown = false}
>
  	{@render children?.()}
</button>