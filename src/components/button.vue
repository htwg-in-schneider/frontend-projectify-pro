<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'accent',
    validator: (value) => ['accent', 'secondary'].includes(value)
  },
  href: {
    type: String,
    default: null
  },
  to: {
    type: String,
    default: null
  }
});
</script>

<template>
  <!-- router-link -->
  <router-link
    v-if="to"
    :to="to"
    class="btn"
    :class="{
      'btn-primary': variant === 'accent',
      'btn-outline-primary': variant === 'secondary'
    }"
  >
    <slot />
  </router-link>

  <a
    v-else-if="href"
    :href="href"
    class="btn"
    :class="{
      'btn-primary': variant === 'accent',
      'btn-outline-primary': variant === 'secondary'
    }"
  >
    <slot />
  </a>

  <button
    v-else
    class="btn"
    :class="{
      'btn-primary': variant === 'accent',
      'btn-outline-primary': variant === 'secondary'
    }"
  >
    <slot />
  </button>
</template>
