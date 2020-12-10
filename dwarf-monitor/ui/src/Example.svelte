<script>
    export let name;
    export let method;
    export let examples;

    function handleClick(payload) {
        return async () => {
            const response = await fetch(`/request?name=${name}&method=${method}&payload=${JSON.stringify(payload)}`);
            alert(JSON.stringify(await response.json()));
        }
    }
</script>

<div>
    <ul>
        {#each examples as example}
            <button on:click={handleClick(example.payload)}>{example.name}</button>
        {/each}
    </ul>
</div>
