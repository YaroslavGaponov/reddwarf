<script>
    export let no;
    export let name = "";
    export let info = {};

    function runExample(name, method, payload) {
        return async () => {
            const response = await fetch(
                `/request?name=${name}&method=${method}&payload=${JSON.stringify(
                    payload
                )}`
            );
            alert(JSON.stringify(await response.json()));
        };
    }
</script>

<style>
    .div-table {
        display: table;
        width: auto;
        background-color: #eee;
        border: 1px solid #666666;
        border-spacing: 5px; /* cellspacing:poor IE support for  this */
    }
    .div-table-row {
        display: table-row;
        width: auto;
        clear: both;
    }
    .div-table-col {
        float: left; /* fix for  buggy browsers */
        display: table-column;
        width: 200px;
        background-color: #ccc;
    }
    .button {
        background-color: #4caf50; /* Green */
        border: none;
        color: white;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        padding: 16px;
    }
</style>

<div>
    <h1>{no + 1}. {name}</h1>
    <div>
        <h2>Instances</h2>
        <div class="div-table">
            <div class="div-table-row">
                <div class="div-table-col">#</div>
                <div class="div-table-col">Id</div>
                <div class="div-table-col">Application Id</div>
                <div class="div-table-col">Host</div>
            </div>
            {#each Object.entries(info.access) as [id, info], i}
                <div class="div-table-row">
                    <div class="div-table-col">{i + 1}</div>
                    <div class="div-table-col">{id}</div>
                    <div class="div-table-col">{info.applicationId}</div>
                    <div class="div-table-col">{info.host}</div>
                </div>
            {/each}
        </div>
    </div>

    <div>
        <h2>Methods</h2>
        <div class="div-table">
            {#each info.info as method}
                <div class="div-table-row">
                    <div class="div-table-col">{method.name}</div>
                    <div class="div-table-col">{method.description}</div>
                </div>

                <div class="div-table-row">
                    <div class="div-table-col">
                        {#each method.examples as example}
                            <button
                                class="button"
                                on:click={runExample(name, method.name, example.payload)}>{example.name}
                            </button>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
