<script setup>
import Navbar from '@/components/navbar.vue'
import Footer from '@/components/footer.vue'
</script>

<template>
  <Navbar />

  <main>
    <router-view />
  </main>

  <Footer />
</template>

<style scoped>
</style>

