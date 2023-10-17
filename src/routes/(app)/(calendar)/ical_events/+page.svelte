<script lang="ts">
	import AsyncTable from "$lib/components/tableElements/AsyncTable.svelte";
	import type { PageData } from "./$types";

    export let data: PageData

    const myTableData = [
        ['Outpost', 'Chi Alpha', 'Start Time', 'End Time', 'Outpost'],
        ['Work On Video', 'Team David', 'Start Time', 'End Time', 'Supporter Work'],
    ]

</script>

<AsyncTable headers={['Name', 'Calendar', 'Start Time', 'End Time', 'Category']} tableData={myTableData}>

</AsyncTable>
