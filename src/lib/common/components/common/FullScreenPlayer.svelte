<script>

    export let isActive
    export let aspectRatio = 16 / 9

    let defaultWidth = "calc(min(calc(90vw / var(--aspectRatioNumber)), 90vh) * var(--aspectRatioNumber))"
    let defaultHeight = "min(calc(90vw / var(--aspectRatioNumber)), 90vh)"

    let inverseWidth = "min(calc(90vh * var(--aspectRatioNumber)), 90vw)"
    let inverseHeight = "calc(90vh + (min((90vw - (90vh * var(--aspectRatioNumber))), 0px) * 1.5))"

    $: cssVarStyles = `--aspectRatioNumber:${aspectRatio}; --customWidth:${aspectRatio > 1 ? defaultWidth : inverseWidth}; --customHeight:${aspectRatio > 1 ? defaultHeight : inverseHeight}`;

    import { browser } from '$app/environment';

    let scrollTop = null;
    let scrollLeft = null;

    function disableScroll() {
        if (browser) {
            scrollTop = 
                window.pageYOffset || window.document.documentElement.scrollTop;
            scrollLeft = 
                window.pageXOffset || window.document.documentElement.scrollLeft,
                window.onscroll = function() {
                window.scrollTo(scrollLeft, scrollTop);
            }};
        }

    function enableScroll() {
        if (browser) {
            window.onscroll = function() {};
        }
    };

    $: if (isActive) {
        disableScroll();
    } else {
        enableScroll();
    }

</script>
<svelte:window on:keydown={(e)=>{if (e?.key === "Escape") isActive = false}} />
{#if isActive}
<div class="fullScreenContainer" on:click={(e)=>{e.target.classList.contains("fullScreenContainer") ? isActive = false : ""}} on:keydown={(e)=>{if (e?.key === "Escape") isActive = false}} style="{cssVarStyles}">
    <div class="contentWrapper">
        <slot/>
    </div>
</div>
{/if}

<style lang="scss">
    @use '$lib/scss/mixins.scss';
    @use '$lib/scss/vars.scss';

    .fullScreenContainer {
        position: fixed;
        inset: -200px;
        animation: fadeUpBlack forwards .15s ease-in;
        @include mixins.centerSingleItem;
        z-index: 500;

        .contentWrapper {
            width: min(var(--customWidth), vars.$max-stretch-width);
            height: var(--customHeight);
            border-radius: calc(1vw + 10px);
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: stretch;
        }
    }
    @keyframes fadeUpBlack {
        from { background-color: rgba(0,0,0,0); }
        to { background-color: rgba(0,0,0,.75); }
    }

</style>