<script setup>
// Keine Imports mehr nötig, wir nutzen direkt HTML/Vue-Elemente
</script>

<template>
  <footer class="bg-light text-center py-4 mt-5 border-top">
    <div class="container">
      <nav class="nav justify-content-center mb-3">
        <router-link to="/datenschutz" class="nav-link text-secondary px-3">Datenschutz</router-link>
        <router-link to="/impressum" class="nav-link text-secondary px-3">Impressum</router-link>
        
        <a href="mailto:kontakt@projectify-pro.de" class="nav-link text-secondary px-3">Kontakt</a>
      </nav>
      <p class="text-muted small mb-0">&copy; 2025 Projectify Pro. Alle Rechte vorbehalten.</p>
    </div>
  </footer>
</template>

<style scoped>
.nav-link:hover {
  color: var(--bs-primary) !important; /* Blauer Hover-Effekt */
  text-decoration: underline;
}
</style>