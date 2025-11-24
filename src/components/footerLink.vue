<script setup>
defineProps({
  href: {
    type: String,
    default: '#'
  }
});
</script>

<template>
  <a :href="href" class="nav-link text-muted px-2">
    <slot />
  </a>
</template>

<style scoped>
.nav-link:hover {
  color: var(--bs-primary) !important;
}
</style>