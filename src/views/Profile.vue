<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted, ref } from 'vue'
import { updateProfileName } from '@/api/userService.js'

const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()

const profileData = ref(null)
const bearerToken = ref('')
const editName = ref('')
const error = ref('')
const successMsg = ref('')

// helpfunktion to copy token
function copyToClipboard(event) {
  event.target.select()
  navigator.clipboard.writeText(event.target.value)
}

function getRoleName(constant) {
  switch (constant) {
    case 'ADMIN': return 'Administrator'
    case 'REGULAR': return 'regulärer Benutzer'
    default: return constant;
  }
}

async function loadProfile() {
  if (isAuthenticated.value) {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE
        }
      })

      bearerToken.value = token
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        profileData.value = data
        editName.value = data.name 
      } else {
        error.value = `Fehler beim Laden des Profils: ${response.status} ${response.statusText}`
      }
    } catch (e) {
      error.value = `Fehler beim Laden des Profils: ${e.message}`
      console.warn('Could not get token:', e)
    }
  }
}

async function handleSaveName() {
  error.value = ''
  successMsg.value = ''
  try {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE
      }
    })
    
    await updateProfileName(token, editName.value)
    successMsg.value = 'Name erfolgreich aktualisiert!'
    profileData.value.name = editName.value // UI update
  } catch (e) {
    error.value = 'Speichern des Namens fehlgeschlagen.'
    console.error(e)
  }
}

onMounted(loadProfile)
</script>

<template>
  <Navbar />
  <div class="container mt-5" style="min-height: 60vh;">
    
    <div v-if="isLoading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="isAuthenticated && user" class="card mx-auto shadow" style="max-width: 600px;">
      <div class="card-header bg-accent text-white">
        <h3 class="mb-0">Benutzer-Profil</h3>
      </div>
      
      <div class="card-body">
        <div v-if="profileData" class="text-center">
          <img 
            :src="user.picture" 
            :alt="user.name" 
            class="rounded-circle mb-3 border border-3 border-primary shadow-sm"
            width="130" 
            height="130"
          >
          
          <div class="mb-4 text-start">
            <label class="form-label fw-bold">Anzeigename ändern</label>
            <div class="input-group">
              <input 
                v-model="editName" 
                type="text" 
                class="form-control" 
                placeholder="Dein Name"
              >
              <button class="btn btn-success" @click="handleSaveName">
                Speichern
              </button>
            </div>
            <small class="text-muted">Dieser Name wird in der App für Aufgaben und Kommentare verwendet.</small>
          </div>

          <div class="mb-3 text-start">
            <label class="form-label fw-bold">E-Mail Adresse (Login)</label>
            <input 
              :value="profileData.email" 
              type="text" 
              class="form-control bg-light" 
              disabled
            >
          </div>

          <div class="text-start mb-3">
            <p class="mb-0"><strong>Rolle:</strong> {{ getRoleName(profileData.role) }}</p>
          </div>

          <div v-if="successMsg" class="alert alert-success py-2">{{ successMsg }}</div>
          <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
        </div>

        <div v-else class="text-muted">
          {{ error || 'Lade Profildaten...' }}
        </div>

        <hr />

        <div class="mt-4 text-start">
          <details>
            <summary class="btn btn-sm btn-outline-secondary mb-2">OAuth2-Debug-Info</summary>
            <div class="mb-3 mt-2">
              <label class="form-label small fw-bold">User Objekt (Auth0):</label>
              <pre class="bg-light p-3 rounded border small" style="max-height: 200px; overflow-y: auto;"><code>{{ JSON.stringify(user, null, 2) }}</code></pre>
              
              <label class="form-label small fw-bold mt-2">Aktueller Bearer Token (für API-Tests):</label>
              <textarea 
                class="form-control small" 
                rows="3" 
                readonly 
                @click="copyToClipboard"
                title="Klicken zum Kopieren"
              >{{ bearerToken }}</textarea>
              <small class="text-muted">Klicken, um den Token für Tools wie Postman zu kopieren.</small>
            </div>
          </details>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning text-center shadow-sm">
      Sie sind nicht eingeloggt. Bitte melden Sie sich an, um Ihr Profil zu sehen.
    </div>
  </div>
</template>

<style scoped>
.bg-accent {
  background-color: #0d6efd; 
}
</style>