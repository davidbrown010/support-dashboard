<script lang="ts">
    export let activeColor: string
    export let buttonText = "Submit"
</script>

<div class="wrapper">
    <input type="submit" value="{buttonText}" class="bg-{activeColor}"/>
</div>

<style lang="scss">

    @use "$lib/scss/fonts.scss";
    @use "$lib/scss/vars.scss";
    @use "$lib/scss/mixins.scss";

    .wrapper {
        @include mixins.centerSingleItem;
        padding-top: calc(clamp(.5rem, .75vw + 0.25rem, .85rem) * 1.75);

        input {
            @include fonts.txt-white;
            font-weight: vars.$font-display-medium;
            padding: clamp(.5rem, .75vw, 1.5rem) clamp(1rem, 1.5vw, 3rem);
            font-size: clamp(1rem, 1vmax, 1.5rem);
            border-radius: 1000px;
            min-width: 8vw;
            transition: transform .5s ease, color .5s ease;
            white-space: nowrap;
            cursor: pointer;

            &:hover {
                transform: scale(1.05);
            }
            &:not(:active) {
                background-color: vars.$color-theme-black;;
            }
        }
    }
    

</style>