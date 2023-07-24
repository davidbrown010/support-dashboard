<script lang="ts">
	import HrefButton from '$lib/components/common/HrefButton.svelte';

    import type { PageData } from './$types';

    export let data: PageData;

</script>
donors
<HrefButton url="/" activeColor="cyan">Home</HrefButton>

{#each data?.donors as donor}
    {donor}
{/each}