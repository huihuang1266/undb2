<script lang="ts">
	import { Checkbox } from 'flowbite-svelte'
	export let value: boolean = false
</script>

<Checkbox bind:checked={value} {...$$restProps} class="max-w-xs" size="18" />
