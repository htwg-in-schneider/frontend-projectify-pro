<script setup>
import Button from './button.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute();


const shouldHideLoginButton = computed(() => {
  return route.meta.hideLoginButton; 
});

</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <div class="container">
          <router-link class="navbar-brand fw-bold text-accent" to="/">
          <img src="../assets/icons/logoImage.png" alt="Logo" style="height: 30px; margin-right: 10px;">
          Projectify Pro
          </router-link>
        
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <img src="../assets/icons/menue.png" alt="Menü" style="height: 24px;">
        </button>

        <div class="collapse navbar-collapse" id="mainNavbar">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li class="nav-item ms-lg-2" v-if="!shouldHideLoginButton">
              <Button to="/login" variant="accent">Jetzt anmelden</Button>
            </li>
            <li class="nav-item ms-lg-2 d-none d-lg-block">
              <Button href="#" variant="secondary" aria-label="Menü">
                <img src="../assets/icons/menue.png" alt="Menü" style="height: 24px; vertical-align: text-bottom;">
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>