<script lang="ts">
	import Service from "./Service.svelte";

	let registry = getRegistry();

	async function getRegistry() {
		const res = await fetch(`/registry`);
		const json = await res.json();

		if (res.ok) {
			return json;
		} else {
			throw new Error("Error");
		}
	}

	function handleClick() {
		registry = getRegistry();
	}
</script>

<div>
	<div><button on:click={handleClick}> fetch registry </button></div>
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
