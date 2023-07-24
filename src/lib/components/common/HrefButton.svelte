<script lang="ts">
    export let url: string
    export let activeColor: string
</script>

<a href="{url}" class="bg-{activeColor}" data-sveltekit-preload-data="hover">
    <slot/>
</a>

<style lang="scss">

    @use "$lib/scss/fonts.scss";
    @use "$lib/scss/vars.scss";

    a {
        display: block;
        @include fonts.txt-white;
        font-weight: vars.$font-display-medium;
        padding: .5rem 1.5rem;
        font-size: clamp(0.55rem, 1.33vw + .33rem, 1rem);
        border-radius: 1000px;
        transition: transform .5s ease, color .5s ease;
        width: min-content;

        &:hover {
            transform: scale(1.05);
        }
        &:not(:active) {
            background-color: vars.$color-theme-black;;
        }
    }

</style>