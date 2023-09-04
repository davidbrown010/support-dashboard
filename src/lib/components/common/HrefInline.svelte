<script lang="ts">

    export let url: string
    export let icon: Icon = "external"
    export let colorMode: ColorMode = "constant"

    type Icon = "page" | "external" | "tel" | "email"
    type ColorMode = "constant" | "colorless"

    const iconFA_Codes = {
        page: "fa-regular fa-file-lines",
        external: "fa-solid fa-arrow-up",
        tel: "fa-solid fa-phone",
        email: "fa-regular fa-envelope"
    }

    $: iconFA_SelectedCode = iconFA_Codes[icon]

</script>

<a href="{url}" class="{icon} {colorMode != "constant" ? "colorless" : ""}" target="{icon=="external" ? "_blank" : "" }" data-sveltekit-preload-data="hover"><slot/><i class="{iconFA_SelectedCode}"></i></a>

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