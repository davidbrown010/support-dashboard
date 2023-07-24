<script lang="ts">

    import HrefButton from '$lib/components/common/HrefButton.svelte';
    import type { PageData } from './$types';

    export let data: PageData;

</script>
tasks
<HrefButton url="/" activeColor="green">Home</HrefButton>

{#each data?.tasks as task}
    {task}
{/each}