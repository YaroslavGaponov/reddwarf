<script lang="ts">
	import Service from "./Service.svelte";

	let registry = {};

	const ws = new WebSocket(`ws://${location.host}/ws`);
	ws.onmessage = function (m) {
		registry = JSON.parse(m.data);
	};
</script>

<style>
</style>

<div>
	<div>
		<h1>Services</h1>
		{#each Object.entries(registry) as [name, info], no}
			<Service {no} {name} {info} />
		{/each}
	</div>
</div>
