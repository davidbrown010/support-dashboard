<script lang="ts">
    export let labelText: string
    export let inputValue: string
    export let additionalAttributes: any
    export let hoverColor = "cyan"
    export let errors: string[] | undefined

    export let inputType = "text"

    const handleInput = (event: {target: {type: string, checked: boolean, value: any}}) => {
        inputValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;        
    };

    const camalize = function camalize(str: string) {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }

    $: inputKey = camalize(labelText)

</script>

<div class="paddingWrapper">
    <div class="wrapper">
        <input type="{inputType}" on:input="{handleInput}" on:change={handleInput} name="{inputKey}" id="{inputKey}" value={inputValue} {...additionalAttributes} class="border-bottom-{hoverColor}" placeholder=" "/>
        <label for="{inputKey}">{labelText}</label>
        {#if errors}<small>{errors}</small>{/if}
    </div>
</div>


<style lang="scss">
    @use "$lib/scss/fonts.scss";
    @use "$lib/scss/vars.scss";
    @use "$lib/scss/mixins.scss";

    .paddingWrapper {
        @include mixins.centerSingleItem;
        padding-top: calc(clamp(.5rem, .75vw + 0.25rem, .85rem) * 1.75);

        .wrapper {
            display: flex;
            flex-direction: column;
            gap: clamp(5px, 1vmax, 10px);
            position: relative;
            align-items: stretch;
            $top: clamp(0.35rem, 0.5vmax, .75rem);
            $left: clamp(0.5rem, 1vmax, 1.25rem);

            label {
                font-size: clamp(1rem, 1.5vw + 0.25rem, 1.25rem);
                font-weight: vars.$font-display-light;
                position: absolute;
                left: $left;
                top: $top;
                transition: left .25s ease-in-out, top .25s ease-in-out, font-size .25s ease-in-out;
            }

            input {
                font-size: clamp(1rem, 1.5vw + 0.25rem, 1.25rem);
                font-weight: vars.$font-display-roman;
                padding: $top $left;
                min-width: 8vw;
                white-space: nowrap;
                border-bottom-width: 2px;
                border-bottom-style: solid;
                transition: border-bottom-color .25s ease;

                &:not(:focus) {
                    border-bottom-color: black;
                }

                &:is(:not(:placeholder-shown), :focus, :hover) + label {
                    top: -50%;
                    left: 0;
                    font-size: clamp(.5rem, .75vw + 0.25rem, .85rem);
                }
            }
            small {
                color: vars.$color-theme-red;
                font-size: clamp(.75rem, .75vw + 0.25rem, 1rem);
            }
        }
    }

</style>