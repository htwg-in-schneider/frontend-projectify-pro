<script setup>
import Footer from '@/components/footer.vue';
import Navbar from '@/components/navbar.vue';
import SpecialBanner from '@/components/specialBanner.vue';
import NavButton from '@/components/navButton.vue';
import Button from '@/components/button.vue';
import { ref, onMounted } from 'vue';
const url = 'https://dummyjson.com/products';


const props = defineProps({
    id: {
        type: [String, Number],
        required: true
    }
});

const product = ref(null);
onMounted(async () => fetchProduct());

async function fetchProduct() {
  try {
    const response = await fetch(`${url}/${props.id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    product.value = await response.json();
    console.log(product.value);
  } catch (error) {
    console.error('Error fetching product:', error);
  }
}

</script>

<template>
    <SpecialBanner text='Nur heute 10% Rabatt mit dem Code "HAPPY10"' />
    <Navbar />

    <section class="container py-5">
        <div v-if="product" class="row">
            <div class="col-md-6">
                <img :src="product.imageUrl" class="img-fluid" :alt="product.title" />
            </div>
            <div class="col-md-6">
                <h2 class="fw-bold">{{ product.title }}</h2>
                <p class="text-accent fw-bold fs-4">{{ product.price }} €</p>
                <p>{{ product.description }}</p>
                <NavButton variant="secondary" class="me-2" to="/">Zurück</NavButton>
                <Button variant="accent">In den Warenkorb</Button>
            </div>
        </div>
        <div v-else class="text-center">
            <p>Produkt wurde nicht gefunden.</p>
            <NavButton variant="secondary" class="me-2" to="/">Zurück</NavButton>
        </div>
    </section>

    <Footer />
</template>