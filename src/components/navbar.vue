<script setup>
import Button from './button.vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const route = useRoute()
const router = useRouter()

const { logout, isAuthenticated, isLoading } = useAuth0()

const shouldHideLoginButton = computed(() => {
  return route.meta.hideLoginButton
})

const login = () => {
  // absichtlich über den Router → authGuard übernimmt Login
  router.push('/dashboard')
}

const logoutUser = () => {
  logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  })
}
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <div class="container">

        <router-link class="navbar-brand fw-bold text-accent" to="/">
          <img
            src="../assets/icons/logoImage.png"
            alt="Logo"
            style="height: 30px; margin-right: 10px;"
          />
          Projectify Pro
        </router-link>

        <button
          class="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <img src="../assets/icons/menue.png" alt="Menü" style="height: 24px;" />
        </button>

        <div class="collapse navbar-collapse" id="mainNavbar">
          <ul class="navbar-nav ms-auto align-items-center">

            <li
              class="nav-item ms-lg-2"
              v-if="!isAuthenticated && !shouldHideLoginButton && !isLoading"
            >
              <Button variant="accent" @click="login">
                Jetzt anmelden
              </Button>
            </li>

            <li
              class="nav-item ms-lg-2"
              v-if="isAuthenticated && !isLoading"
            >
              <Button variant="accent" @click="logoutUser">
                Abmelden
              </Button>
            </li>

            <li class="nav-item dropdown ms-lg-2 d-none d-lg-block">
              <Button 
                variant="secondary"
                class="dropdown-toggle"
                id="navbarDropdown"
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <img src="../assets/icons/menue.png" style="height: 24px;" />
              </Button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="router.push('/')">
                    Startseite
                  </a>
                </li>
                
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="router.push('/dashboard')">
                    Dashboard
                  </a>
                </li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>