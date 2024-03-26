<script lang="ts">
    export let labelText: string
    export let inputValue: string
    export let additionalAttributes: any = {}

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
        <input type="{inputType}" on:input="{handleInput}" on:change={handleInput} name="{inputKey}" id="{inputKey}" value={inputValue} {...additionalAttributes} class="hidden" placeholder=" "/>
    </div>
</div>


<style lang="scss">
    .hidden {
        display: none;
    }
</style>