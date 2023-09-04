<script lang="ts">
	import HrefInline from "$lib/components/common/HrefInline.svelte";
    import { superForm } from "sveltekit-superforms/client";
    import type { PageData } from "./$types";

    import { page } from '$app/stores';

    $: urlMessage = $page.url.searchParams.get('message');
    
    export let data: PageData

    const { form, errors, enhance, constraints } = superForm(data.form)

</script>

<h1>Log In</h1>
{#if urlMessage}<small>{urlMessage}</small>{/if}
<form method="post" use:enhance>
    <label for="username">Username</label>
	<input name="username" id="username" bind:value={$form.username} {...$constraints.username}/><br/>
    {#if $errors.username}<small>{$errors.username}</small>{/if}

	<label for="password">Password</label>
	<input type="password" name="password" id="password" bind:value={$form.password} {...$constraints.password}/><br/>
    {#if $errors.password}<small>{$errors.password}</small>{/if}

	<input type="submit" />
</form>
<HrefInline url={"/register"} icon={"page"}>Register</HrefInline>