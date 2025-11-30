<script setup>
import Footer from '@/components/footer.vue';
import Navbar from '@/components/navbar.vue';
import SpecialBanner from '@/components/specialBanner.vue';
import ProductCard from '@/components/productCard.vue';
import { ref, onMounted } from 'vue';
//const url = 'https://dummyjson.com/products';
const url = 'http://localhost:8081/api/product';

const products = ref([]);
onMounted(async () => fetchProducts());

async function fetchProducts() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    products.value = data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

</script>

<template>
  <SpecialBanner text='Nur heute 10% Rabatt mit dem Code "HAPPY10"' />
  <Navbar />

  <section class="py-5 text-center">
    <div class="container">
      <h2 class="fw-bold">Produkte</h2>
      <p>Entdecke unsere Auswahl an hochwertigen Produkten und Dienstleistungen.</p>
    </div>
  </section>

  <div class="container py-4">
    <div class="row g-4">
            <div v-for="product in products" :key="product.id" class="col-md-4">
        <ProductCard :product="product" />
      </div>
    </div>
  </div>

  <Footer />
</template>

<style scoped></style> 