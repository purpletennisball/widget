<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'secondary' | 'muted';
		children?: Snippet;
		flexGrowing?: boolean;
		shapeMorphing?: boolean;
	}
	let { 
		variant = 'primary', 
		children, 
		class: className = '',
		flexGrowing,
		shapeMorphing,
		...restProps 
	}: Props = $props();
</script>

<button 
	class={["widgetyButton", `widgetyButton-${variant}`, `${className}`, flexGrowing && "flexGrowingButtonStyle", shapeMorphing && "shapeMorphingButtonStyle"]} 
	{...restProps}
>
	{@render children?.()}
</button>