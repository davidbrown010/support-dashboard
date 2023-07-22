<script>

    //Must have a wrapper for positioning

    export let color
    import COCircle from '$lib/images/calling/CO State Circle Text.png'

</script>

<div class="colorCircle bg-{color}">
    <div class="wrapper">
        <img src="{COCircle}" alt="US Missionary to Fort Collins CO graphic">
    </div>
</div>


<style lang="scss">
    @use '$lib/scss/mixins.scss';

    .colorCircle {
        width: 100%;
        height: 100%;
        @include mixins.circle;
        @include mixins.centerSingleItem;

        .wrapper {
            width: 100%;
            height: 100%;
            position: relative;
            @include mixins.centerSingleItem;

            img {
                width: 90%;
                height: 90%;
                object-fit: contain;
                pointer-events: none;
            }
        }
    }
</style>