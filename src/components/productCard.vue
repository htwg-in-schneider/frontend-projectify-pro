<script setup>
import NavButton from '@/components/navButton.vue';
defineProps({
  product: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <NavButton href="#" class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">{{ product.title }}</h5>
      <small class="text-muted">{{ product.price }} €</small>
    </div>
    <p class="mb-1">{{ product.description }}</p>
    <small class="text-muted">Kategorie: {{ product.category }}</small>
    <NavButton variant="accent" class="mt-auto" :to="`/product/${product.id}`"></NavButton>
  </NavButton>
</template>

<style scoped>
</style>