<script>
    export let clickAction
</script>

<button on:click={clickAction}>
    <slot/>
</button>

<style lang="scss">

    @use "$lib/scss/fonts.scss";
    @use "$lib/scss/vars.scss";

    button {
        @include fonts.txt-black;
        font-weight: vars.$font-display-roman;
        padding: clamp(.25rem, .5vw, .75rem) clamp(.75rem, 1.5vw, 3rem);
        font-size: clamp(.75rem, 1.5vw, 3rem);
        border-radius: 1000px;
        background-color: transparent;
        border: clamp(1px, .5vw, 3px) solid vars.$color-theme-black;
        min-width: 8vw;
        transition: transform .125s ease, color .125s ease, background-color .125s ease;
        white-space: nowrap;
        display: flex;
        flex-wrap: nowrap;
        justify-content: start;
        align-items: center;

        &:hover {
            transform: scale(1.05);
        }
        &:active {
            background-color: vars.$color-theme-black;
            @include fonts.txt-white;
        }
    }

</style>