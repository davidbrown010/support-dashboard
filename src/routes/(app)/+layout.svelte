<script lang="ts">
	import '$lib/scss/styles.scss';
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