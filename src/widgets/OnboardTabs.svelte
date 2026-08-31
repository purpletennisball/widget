<script lang="ts">
	interface Props {
		tabs: number;
		currentTab: number;
  	}

	let { tabs, currentTab }: Props = $props();
</script>

<div class="onboardTabs">
{#each {length: tabs} as _, index}
	<div class ={["onboardTab", index < currentTab && "tabDone", index === currentTab-1 && "tabCurrent"]}></div>
{/each}
</div>