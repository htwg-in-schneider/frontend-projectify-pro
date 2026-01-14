<script setup>
import Navbar from '@/components/navbar.vue'
import Footer from '@/components/footer.vue'
import SpecialBanner from '@/components/specialBanner.vue'
</script>

<template>
  <SpecialBanner /> 

  <Navbar />

  <main>
    <router-view />
  </main>

  <Footer />
</template>

<style scoped>
</style>