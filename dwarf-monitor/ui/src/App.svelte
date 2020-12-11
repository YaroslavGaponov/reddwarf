<script lang="ts">
	import Service from "./Service.svelte";

	let registry = {};

	const ws = new WebSocket(`ws://${location.host}/ws`);
	ws.onmessage = function (m) {
		registry = JSON.parse(m.data);
	};
</script>

<div>
	<div>
		{#await registry}
			<p>...waiting</p>
		{:then registry}
			<h2>Services</h2>
			{#each Object.entries(registry) as [name, info]}
				<Service {name} {info} />
			{/each}
		{/await}
	</div>
</div>
