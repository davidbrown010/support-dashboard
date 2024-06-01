<script lang="ts">
	import HrefButton from '$lib/components/common/HrefButton.svelte';
    import type { PageData } from '../../../$types';

    export let data: PageData;
    
</script>

<HrefButton url="/calendar" activeColor="cyan">Calendar</HrefButton>
<!-- <HrefButton url="/my_calendars/manage" activeColor="cyan">Manage Calendars</HrefButton> -->

{#await data.streaming.reports}
    Loading...
{:then reports} 
    {#each reports as report, index}
        <section class="lookerReport">
            <iframe title={`Report ${index+1}`} src={`https://lookerstudio.google.com/embed/reporting/${report.reportId}`} frameborder="0" style="border:0" allowfullscreen></iframe>
        </section>
    {/each}
{/await}

<style lang="scss">
    .lookerReport {
        width: 100%;

        iframe {
            width: 100%;
            min-height: 250vw;
        }
    }
</style>