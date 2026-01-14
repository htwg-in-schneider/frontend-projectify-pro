<script setup>
import Button from './button.vue'
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const route = useRoute()
const router = useRouter()

const { logout, isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0()
const profileData = ref(null)

const shouldHideLoginButton = computed(() => {
  return route.meta.hideLoginButton
})

// load user role from backend
async function loadUserRole() {
  if (isAuthenticated.value) {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE
        }
      })
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        profileData.value = await response.json()
      }
    } catch (e) {
      console.warn('Rollen konnten nicht geladen werden', e)
    }
  }
}

// watch for auth changes
watch(isAuthenticated, (newVal) => {
  if (newVal) loadUserRole()
})

onMounted(loadUserRole)

const login = () => {
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
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
      <div class="container-fluid px-4 px-lg-5">

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
              class="nav-item ms-lg-2 order-2 order-lg-1"
              v-if="!isAuthenticated && !shouldHideLoginButton && !isLoading"
            >
              <Button variant="accent" @click="login">
                Jetzt anmelden
              </Button>
            </li>

            <li 
              class="nav-item dropdown ms-lg-3 order-lg-2" 
              v-if="isAuthenticated && !isLoading"
            >
              <a 
                class="nav-link dropdown-toggle p-0" 
                href="#" 
                id="userProfileDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <img 
                  :src="user?.picture" 
                  alt="Profil" 
                  class="rounded-circle border border-2 border-primary" 
                  style="height: 38px; width: 38px; object-fit: cover;"
                />
              </a>
              <ul class="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="userProfileDropdown">
                <li class="dropdown-header">
                  Eingeloggt als: <strong>{{ user?.nickname || user?.name || 'Benutzer' }}</strong>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <router-link class="dropdown-item" to="/profile">Mein Profil</router-link>
                </li>
                
                <li v-if="profileData?.role === 'ADMIN'">
                  <router-link class="dropdown-item" to="/admin/users">
                    Nutzerverwaltung
                  </router-link>
                </li>

                <li><hr class="dropdown-divider"></li>
                <li>
                  <button class="dropdown-item text-danger" @click="logoutUser">Abmelden</button>
                </li>
              </ul>
            </li>

            <li class="nav-item dropdown ms-lg-2 order-1 order-lg-3">
              <Button 
                variant="secondary"
                class="dropdown-toggle"
                id="navbarDropdown"
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <img src="../assets/icons/menue.png" style="height: 24px;" />
              </Button>
              <ul class="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="navbarDropdown">
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

<style scoped>
.dropdown-toggle::after {
  display: none;
}
</style>