<script lang="ts">
	import '$lib/scss/styles.scss';
	// import Analytics from '$lib/seo/analytics.svelte';
</script>

<div class="app">
	<main>
		<slot/>
	</main>
	<!-- <Analytics /> -->
</div>

<style lang="scss">
	main {
		position: relative;
	}
</style>