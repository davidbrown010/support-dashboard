<script>
    import '$lib/scss/styles.scss';
</script>

<div class="app">
	<main>
		<section class="section">
            <h1>Donor Not Found</h1>
            <p>This donor either doesn't exist or doesn't below to you</p>
        </section>
	</main>
</div>

<style lang="scss">
    main {
		position: relative;
		// scroll-snap-type: y mandatory;
	}

    section {
        padding: 0 clamp(10px, 10vw, 100px);

        h1 {
            font-size: clamp(1rem, 2.5vw, 2rem);
        }
        p {
            font-size: clamp(.75rem, 1.5vw, 1.25rem);
        }
    }
</style>