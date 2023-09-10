<script lang="ts">
	import HrefInline from "$lib/components/common/HrefInline.svelte";
    import { superForm } from "sveltekit-superforms/client";
    import type { PageData } from "./$types";
    
    export let data: PageData    

    const { form, errors, enhance, constraints } = superForm(data.form)

    import TextInput from "$lib/components/formElements/TextInput.svelte";
    import SubmitInput from "$lib/components/formElements/SubmitInput.svelte";

</script>

<div class="container">
    <div class="centerWrapper">
        <h1>Sign Up</h1>
        <form method="post" use:enhance>

            <TextInput inputType="text" labelText="first name" bind:inputValue={$form.firstName} additionalAttributes={$constraints.firstName} errors={$errors.firstName}/>
            <TextInput inputType="text" labelText="last name" bind:inputValue={$form.lastName} additionalAttributes={$constraints.lastName} errors={$errors.lastName}/>
            <TextInput inputType="text" labelText="username" bind:inputValue={$form.username} additionalAttributes={$constraints.username} errors={$errors.username}/>
            <TextInput inputType="password" labelText="password" bind:inputValue={$form.password} additionalAttributes={$constraints.password} errors={$errors.password}/>

            <SubmitInput activeColor="cyan" buttonText="Register"/>
        </form>
    </div>
    <div class="signInWrapper">
        <span>Already have an account? </span><HrefInline url={"/login"} icon={"page"}>Login</HrefInline>
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
        .signInWrapper {
            position: absolute;
            top: 40px;
            right: 40px;
        }
    }
</style>
