<script lang="ts">
	import HrefButton from '$lib/components/common/HrefButton.svelte';
	import HrefInline from '$lib/components/common/HrefInline.svelte';

    import type { PageData } from './$types';

    export let data: PageData;

</script>
donors
<HrefButton url="/" activeColor="cyan">Home</HrefButton>

{#await data.streaming.donors}
   Loading... 
{:then donors} 
    {#each donors as donor}
        {#if donor.displayName}
            <HrefInline url="/donors/{donor.id}" icon="page">{donor.displayName}</HrefInline> <br>
        {/if}
        
    {/each}
{/await}