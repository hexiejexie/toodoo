<template>
  <div
    class="px-3 h-6 rounded-full text-xs font-semibold flex items-center"
    :class="`bg-${color}-100 text-${color}-700`"
  >
    <span
      v-if="showDot"
      class="w-2 h-2 rounded-full mr-1"
      :class="`bg-${color}-400`"
    ></span>
    <span>
      <slot></slot>
    </span>
  </div>
</template>
<script>
export default {
  name: 'Badge',
  props: {
    color: {
      type: String,
      default: 'teal'
    },
    showDot: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>
