<script>
    export let clickAction
    export let activeColor
</script>

<button on:click={clickAction} class="bg-{activeColor}">
    <slot/>
</button>

<style lang="scss">

    @use "$lib/scss/fonts.scss";
    @use "$lib/scss/vars.scss";

    button {
        @include fonts.txt-white;
        font-weight: vars.$font-display-medium;
        padding: clamp(.5rem, .75vw, 1.5rem) clamp(1rem, 1.5vw, 3rem);
        font-size: clamp(1rem, 1.5vw, 3rem);
        border-radius: 1000px;
        min-width: 8vw;
        transition: transform .5s ease, color .5s ease;
        white-space: nowrap;

        &:hover {
            transform: scale(1.05);
        }
        &:not(:active) {
            background-color: vars.$color-theme-black;;
        }
    }

</style>