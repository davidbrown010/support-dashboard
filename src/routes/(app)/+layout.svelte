<script lang="ts">
	import { enhance } from '$app/forms';
	import '$lib/scss/styles.scss';

</script>

<div class="app">
	<main>
		<form method="post" action="/logout?/logout" use:enhance>
			<input type="submit" value="Sign Out" />
		</form>
		<slot/>
	</main>
	<!-- <Analytics /> -->
</div>

<style lang="scss">
	main {
		position: relative;
	}
</style>