<script lang="ts">
	import Service from "./Service.svelte";

	let registry = {};

	const ws = new WebSocket(`ws://${location.host}/ws`);
	ws.onmessage = function (m) {
		registry = JSON.parse(m.data);
	};
</script>

<style>
	p {
		color: rgb(10, 10, 10);
		font-family: "Comic Sans MS", cursive;
		font-size: 2em;
	}
</style>

<div>
	<div>
		{#await registry}
			<p>...waiting</p>
		{:then registry}
			<h1>Services</h1>
			{#each Object.entries(registry) as [name, info], no}
				<Service {no} {name} {info} />
			{/each}
		{/await}
	</div>
</div>
