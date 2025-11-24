<script setup>
import Footer from '@/components/footer.vue';
import Navbar from '@/components/navbar.vue';
import ProductCard from '@/components/productCard.vue';

import { products } from '@/data.js';

function getProducts() {
  return products;
}
</script>

<template>
  <SpecialBanner text='Nur heute 10% Rabatt mit dem Code "HAPPY10"' />
  <Navbar />

  <section class="py-5 text-center">
    <div class="container">
      <h2 class="fw-bold">Produkte</h2>
      <p>Entdecke unsere Auswahl an hochwertigen Produkten für Anfänger und Profis.</p>
    </div>
  </section>

  <div class="container py-4">
    <div class="row g-4">
      <div v-for="product in getProducts()" :key="product.id" class="col-md-4">
        <ProductCard :product="product" />
      </div>
    </div>
  </div>

  <Footer />
</template>

<style scoped></style> 