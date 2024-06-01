<script lang="ts">

    import type { PageData } from "./$types";


    export let data: PageData;

</script>

Notes:
{#await data.streaming.donorNotes}
    Loading notes...
{:then notes} 
    {#each notes as note}
        {note.noteText}
    {/each}
{/await}