<script>

    //Must have a wrapper for positioning

    export let color
    export let logoSrc
    export let logoAlt
    export let fullSize = false

</script>

<div class="logoCircle bg-{color}">
    <img src="{logoSrc}" alt="{logoAlt}" class="logo" style="{fullSize && "width: 100% !important; height: 100% !important; object-fit: cover !important;"}">
</div>

<style lang="scss">
    @use "$lib/scss/mixins.scss";

    .logoCircle {
        @include mixins.centerSingleItem;
        @include mixins.circle;
        overflow: hidden;
        height: 100%;
        width: 100%;

        .logo {
            width: 60%;
            height: 60%;
            object-fit: contain;
        }
    }
</style>