<script lang="ts">
	import HrefInline from "$lib/components/common/HrefInline.svelte";
    import TextInput from "$lib/components/formElements/TextInput.svelte";
    import { superForm } from "sveltekit-superforms/client";
    import type { PageData } from "./$types";

    import { page } from '$app/stores';
	import SubmitInput from "$lib/components/formElements/SubmitInput.svelte";

    $: urlMessage = $page.url.searchParams.get('message');
    
    export let data: PageData

    const { form, errors, enhance, constraints } = superForm(data.form)

</script>

<div class="container">
    <div class="centerWrapper">
        <h1>Log In</h1>
        {#if urlMessage}<small>{urlMessage}</small>{/if}
        <form method="post" use:enhance>

            <TextInput inputType="text" labelText="username" bind:inputValue={$form.username} additionalAttributes={$constraints.username} errors={$errors.username}/>
            <TextInput inputType="password" labelText="password" bind:inputValue={$form.password} additionalAttributes={$constraints.password} errors={$errors.password}/>

            <SubmitInput activeColor="cyan" buttonText="Login"/>
        </form>
    </div>
    <div class="registerWrapper">
        <span>Don't have an account? </span><HrefInline url={"/register"} icon={"page"}>Sign Up</HrefInline>
    </div>
</div>

<style lang="scss">
    @use "$lib/scss/mixins.scss";

    .container {
        height: 100vh;
        @include mixins.centerSingleItem;

        .centerWrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;

            form {
                display: inherit;
                flex-direction: inherit;
                align-items: left;
                gap: inherit;
                
                
            }
        }
        .registerWrapper {
            position: absolute;
            top: 40px;
            right: 40px;
        }
    }
</style>