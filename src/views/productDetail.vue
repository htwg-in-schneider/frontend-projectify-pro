<script setup>
import Footer from '@/components/footer.vue';
import Navbar from '@/components/navbar.vue';
import NavButton from '@/components/navButton.vue';
import Button from '@/components/button.vue';
import { computed } from 'vue';
import { products } from '@/data.js';

const props = defineProps({
    id: {
        type: [String, Number],
        required: true
    }
});

const product = computed(() => {
    return products.find(p => String(p.id) === String(props.id)) || null;
});
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