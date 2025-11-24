<script setup>
defineProps({
  variant: {
    type: String,
    default: 'accent',
    validator: (value) => ['accent', 'secondary'].includes(value)
  },
  href: {
    type: String,
    default: null
  }
});
</script>

<template>
  <component
    :is="href ? 'a' : 'navButton'"
    :href="href"
    class="btn"
    :class="{
      'btn-primary': variant === 'accent',
      'btn-outline-primary': variant === 'secondary'
    }"
  >
    <slot />
  </component>
</template>

<style scoped>
</style>