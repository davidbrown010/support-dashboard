<script lang="ts">
	import HrefButton from "$lib/components/common/HrefButton.svelte";
    import type { PageData } from "./$types";

    export let data: PageData

</script>

<h1>Home</h1>

Welcome back {data.user.firstName}!

<div class="btnWrapper">
    <HrefButton url="/donors" activeColor="cyan">Donors</HrefButton>
    <HrefButton url="/tasks" activeColor="green">Tasks</HrefButton>
    <HrefButton url="/my_calendars" activeColor="red">Calendar</HrefButton>
</div>

<style lang="scss">
    .btnWrapper {
        display: flex;
        flex-direction: column;
    }
</style>
