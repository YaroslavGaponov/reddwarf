<script>
    import Example from "./Example.svelte";

    export let name;
    export let info;
</script>

<div>
    <h2>{name}</h2>
    <div>
        <b>Instances</b>
        <ul>
            {#each info.access as id}
                <li>{id}</li>
            {/each}
        </ul>
    </div>
    <div>
        <b>Methods<b>
                <ul>
                    {#each info.info as method}
                        <li>{method.name} - {method.description}</li>
                        <Example {name} method={method.name} examples={method.examples} />
                    {/each}
                </ul>
            </b></b>
    </div>
</div>
