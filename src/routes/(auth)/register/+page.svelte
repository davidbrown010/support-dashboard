<script lang="ts">
	import HrefInline from "$lib/components/common/HrefInline.svelte";
    import { superForm } from "sveltekit-superforms/client";
    import type { PageData } from "./$types";
    
    export let data: PageData

    const { form, errors, enhance, constraints } = superForm(data.form)

</script>

<h1>Sign up</h1>
<form method="post" use:enhance>
    <label for="firstName">First Name</label>
	<input name="firstName" id="firstName" bind:value={$form.firstName} {...$constraints.firstName}/><br/>
    {#if $errors.firstName}<small>{$errors.firstName}</small>{/if}

    <label for="lastName">Last Name</label>
	<input name="lastName" id="lastName" bind:value={$form.lastName} {...$constraints.lastName}/><br/>
    {#if $errors.lastName}<small>{$errors.lastName}</small>{/if}

	<label for="username">Username</label>
	<input name="username" id="username" bind:value={$form.username} {...$constraints.username}/><br/>
    {#if $errors.username}<small>{$errors.username}</small>{/if}

	<label for="password">Password</label>
	<input type="password" name="password" id="password" bind:value={$form.password} {...$constraints.password}/><br/>
    {#if $errors.password}<small>{$errors.password}</small>{/if}

	<input type="submit" />
</form>
<HrefInline url={"/login"} icon={"page"}>Login</HrefInline>