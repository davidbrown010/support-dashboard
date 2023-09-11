<script lang="ts">

    import type { PageData } from "./$types";

    export let data: PageData;

</script>

General Info: <br>
{#await data.streaming.donor}
    (Donor Info)
{:then donor} 
   {donor.supporterType}
{/await}