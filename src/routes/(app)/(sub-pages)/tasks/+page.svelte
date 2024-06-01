<script lang="ts">

    import type { PageData } from './$types';

    export let data: PageData;

</script>
tasks

{#await data.streaming.tasks}
   Loading... 
{:then tasks} 
    {#each tasks as task}
        {task.taskName}<br>
    {/each}
{/await}