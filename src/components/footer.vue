<script setup>
</script>

<template>
  <footer class="bg-white text-center py-4 mt-5 border-top">
    <div class="container">
      
      <nav class="nav justify-content-center mb-2">
        <router-link to="/datenschutz" class="nav-link px-3 text-secondary">Datenschutz</router-link>
        <router-link to="/impressum" class="nav-link px-3 text-secondary">Impressum</router-link>
        <a href="mailto:projectify.pro@web.de" class="nav-link px-3 text-secondary">Kontakt</a>
      </nav>

      <p class="text-muted small mb-0">&copy; 2025 Projectify Pro. Alle Rechte vorbehalten.</p>
    </div>
  </footer>
</template>

<style scoped>
.nav-link:hover {
  color: #000 !important; 
  text-decoration: underline;
}
</style>