<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'secondary' | 'muted';
		children?: Snippet;
		flexGrowing?: boolean;
	}
	let { 
		variant = 'primary', 
		children, 
		class: className = '',
		flexGrowing,
		...restProps 
	}: Props = $props();
</script>

<button 
	class={["widgetyButton", `widgetyButton-${variant}`, `${className}`, flexGrowing && "flexGrowingButtonStyle"]} 
	{...restProps}
>
	{@render children?.()}
</button>