<script lang="ts">
	import HrefButton from '$lib/components/common/HrefButton.svelte';

    import type { PageData } from './$types';

    export let data: PageData;

</script>
tasks
<HrefButton url="/" activeColor="cyan">Home</HrefButton>

{#await data.streaming.tasks}
   Loading... 
{:then tasks} 
    {#each tasks as task}
        {task.taskName}<br>
    {/each}
{/await}