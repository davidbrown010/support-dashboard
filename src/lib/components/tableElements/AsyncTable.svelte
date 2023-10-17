<script lang="ts">

    export let headers: string[]

    export let tableData: string[][]

</script>


<div class="wrapper">
    <table>
        <colgroup>
            {#each headers as _, index}
                <col />
            {/each}
          </colgroup>
        <tr>
            {#each headers as header}
                <th>{header}</th>
            {/each}
        </tr>
        {#each tableData as row}
            <tr>
                {#each row as value}
                    <td>{value}</td>
                {/each}
            </tr>
        {/each}
    </table>
</div>


<style lang="scss">
    @use "$lib/scss/fonts.scss";
    @use "$lib/scss/vars.scss";
    @use "$lib/scss/mixins.scss";

    table {
        border-collapse: collapse;
        
        colgroup {
            display: flex;
            align-items: center;
            justify-content: stretch;

            col {

            }
        }
        td, th {
            border: 1px solid black;
        }
    }

</style>