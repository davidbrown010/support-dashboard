<script lang="ts">
	import type { LayoutData } from './$types';
    
    export let data: LayoutData;

</script>

{#await data.streaming.donor}
    (Donor Name)
{:then donor} 
    {donor.displayName}
    <br>
    <a href="/donors/{donor.id}">Info</a>
    <a href="/donors/{donor.id}/notes">Notes</a>
{/await}
<br>
<slot/>