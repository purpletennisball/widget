<script lang="ts">
	import Title from "../Title.svelte";
	import SelectionBox from "../SelectionBox.svelte";

	interface Props {
		value: string;
  	}

	let { value = $bindable() }: Props = $props();
</script>

<SelectionBox bind:value={value} key={"prop"}>
	<Title title="Property" subtitle="Saves data in the file properties." />
</SelectionBox>
<SelectionBox bind:value={value} key={"global"}>
	<Title title="Global" subtitle="Saves data in the plugin file. Keeps value the same across notes." />
</SelectionBox>