<template>
  <button type="button" class="inline-flex px-4 py-2 text-white font-bold rounded items-center" :class="typeClasses">
    <slot/>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String
    }
  },
  computed: {
    typeClasses () {
      switch (this.type) {
        case 'danger':
          return 'bg-red'
        default:
          return 'bg-teal'
      }
    }
  }
}
</script>
