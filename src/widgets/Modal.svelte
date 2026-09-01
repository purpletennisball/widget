<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		showModal: boolean;
		children: Snippet;
	}

	let { showModal = $bindable(), children } = $props();

	let dialog = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		if (showModal && dialog) dialog.showModal();
	});
</script>

<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => { if (e.target === dialog) dialog?.close(); }}
	class="widgetyModal"
>
	{@render children?.()}
</dialog>