<script lang="ts">
	import HrefButton from '$lib/components/common/HrefButton.svelte';

    import type { PageData } from './$types';

    export let data: PageData;

</script>
donors
<HrefButton url="/" activeColor="cyan">Home</HrefButton>

{#await data.streaming.donors}
   Loading... 
{:then donors} 
    {#each donors as donor}
        {donor.firstName + " " + donor.lastName}<br>
    {/each}
{/await}