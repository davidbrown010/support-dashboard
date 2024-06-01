<script lang="ts">
	import HrefButton from '$lib/components/common/HrefButton.svelte';

    import type { PageData } from './$types';

    export let data: PageData;

</script>

Settings
<HrefButton url="/settings/api_keys" activeColor="red">Api Keys</HrefButton>