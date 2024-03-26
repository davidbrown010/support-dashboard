<script lang="ts">
    export let activeColor: string
    export let buttonText = "test"
</script>

<div class="wrapper">
    <button type="submit" name="{buttonText}" class="bg-{activeColor}"></button>
    <i class="fa-solid fa-trash-can"></i>
</div>

<style lang="scss">

    @use "$lib/scss/fonts.scss";
    @use "$lib/scss/vars.scss";
    @use "$lib/scss/mixins.scss";

    * {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .wrapper {
        position: relative;
        width: clamp(2rem, 2vmax, 3rem);
        height: clamp(2rem, 2vmax, 3rem);

        button { 
            
            border-radius: 1000px;
            width: inherit;
            height: inherit;

            transition: transform .5s ease, color .5s ease;
            white-space: nowrap;
            cursor: pointer;

            &:hover {
                transform: translate(-50%, -50%) scale(1.05);
            }
            &:not(:active) {
                background-color: vars.$color-theme-red-action;
            }
        }

        i {
            @include fonts.txt-white;
            font-size: clamp(1rem, 1vmax, 1.5rem);
            pointer-events: none;
        }
    }
    

</style>