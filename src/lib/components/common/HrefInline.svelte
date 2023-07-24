<script lang="ts">

    export let url: string
    export let type = "external"
    export let colorMode = "constant"

    const types = {
        page: "fa-regular fa-file-lines",
        external: "fa-solid fa-arrow-up",
        tel: "fa-solid fa-phone",
        email: "fa-regular fa-envelope"
    }

    $: icon = types[type]

</script>

<a href="{url}" class="{type} {colorMode != "constant" ? "colorless" : ""}" target="{type=="external" ? "_blank" : "" }" data-sveltekit-preload-data="hover"><slot/><i class="{icon}"></i></a>

<style lang="scss">
    @use '$lib/scss/vars.scss';

    a {

        &.external {
            color: vars.$color-theme-red;

            i {
                transform-origin: center;
                transform: translate(-15%, 5%) rotate(45deg);
            }
        }

        &.page {
            color: vars.$color-theme-orange;
        }

        &.tel {
            color: vars.$color-theme-teal;
        }

        &.email {
            color: vars.$color-theme-cyan;
            
            i {
                transform: translateY(7%);
            }
        }

        i {
            margin-left: clamp(3px, .5ch, 1rem);
            // margin-right: clamp(1px, .25ch, .5rem);
        }

        &.colorless:not(:active) {
            color: vars.$color-theme-black !important;
        }
    }

</style>