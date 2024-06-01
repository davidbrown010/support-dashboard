<script lang="ts">
	import HrefButton from '$lib/components/common/HrefButton.svelte';

    import type { PageData } from "./$types";
    import { enhance } from '$app/forms';

    import { page } from '$app/stores';
	import SubmitInput from "$lib/components/formElements/SubmitInput.svelte";
    import HiddenValue from "$lib/components/formElements/HiddenValue.svelte";
    import TrashButton from "$lib/components/formElements/TrashButton.svelte";

    $: urlMessage = $page.url.searchParams.get('message');
    
    export let data: PageData


</script>

<HrefButton url="/settings" activeColor="orange">Settings</HrefButton>
<form method="post" use:enhance action="?/requestApiKey">
    <SubmitInput activeColor="cyan" buttonText="Request New Api Key"/>
</form>
<div>
    {#await data.streaming.apiKeys}
        Loading Keys...
    {:then apiKeys} 
        {#each apiKeys as apiKeyObj}
            <form method="post" use:enhance action="?/removeApiKey">
                {apiKeyObj.apiKey}: {new Date(apiKeyObj.expires)}
                <HiddenValue labelText="Api Key Id" inputValue={`${apiKeyObj.id}`}/>
                <TrashButton activeColor="black" buttonText="Trash"/>
            </form>
        {/each}
    {/await}
</div>
