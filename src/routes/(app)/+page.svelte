<script lang="ts">
	import HrefButton from "$lib/components/common/HrefButton.svelte";

</script>

<h1>Home</h1>

<div class="btnWrapper">
    <HrefButton url="/donors" activeColor="cyan">Donors</HrefButton>
    <HrefButton url="/tasks" activeColor="green">Tasks</HrefButton>
</div>

<style lang="scss">
    .btnWrapper {
        display: flex;
        flex-direction: column;
    }
</style>