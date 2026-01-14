<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { getAllUsers } from '@/api/userService.js'

const { getAccessTokenSilently } = useAuth0()
const users = ref([])
const searchQuery = ref('')
const loading = ref(true)

// API URL aus der .env oder Standardwert
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const filteredUsers = computed(() => {
  return users.value.filter(u => 
    u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

async function fetchUsers() {
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    users.value = await getAllUsers(token)
  } catch (e) {
    console.error("Fehler beim Laden der Nutzer:", e)
  } finally {
    loading.value = false
  }
}

// --- NAME ÄNDERN (Stammdaten verändern laut Blatt 5b) ---
async function editName(user) {
  const newName = prompt(`Neuen Namen für ${user.email} eingeben:`, user.name)
  
  if (newName === null || newName.trim() === "" || newName === user.name) {
    return // Abbrechen wenn leer oder unverändert
  }

  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`${baseUrl}/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        ...user,
        name: newName
      })
    })

    if (response.ok) {
      alert('Name erfolgreich aktualisiert')
      await fetchUsers()
    } else {
      alert('Fehler beim Aktualisieren: ' + response.status)
    }
  } catch (e) {
    console.error("Fehler:", e)
    alert('Verbindung zum Server fehlgeschlagen')
  }
}

// --- LÖSCHEN FUNKTION (Stammdaten löschen laut Blatt 5b) ---
async function deleteUser(id) {
  if (!confirm('Möchten Sie diesen Nutzer wirklich löschen?')) return

  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`${baseUrl}/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.ok) {
      alert('Nutzer erfolgreich gelöscht')
      await fetchUsers() 
    } else {
      alert('Fehler beim Löschen')
    }
  } catch (e) {
    console.error("Fehler:", e)
  }
}

onMounted(fetchUsers)
</script>

<template>
  <div class="container mt-4">
    <div class="mb-3">
      <input 
        v-model="searchQuery" 
        type="text" 
        class="form-control" 
        placeholder="Nach Name oder E-Mail suchen..."
      >
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2">Lade Benutzerdaten...</p>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover table-bordered shadow-sm bg-white">
        <thead class="table">
          <tr>
            <th>Name</th>
            <th>E-Mail (Login)</th>
            <th>Status</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in filteredUsers" :key="u.id">
            <td>{{ u.name }}</td>
            <td class="text-muted">{{ u.email }}</td>
            <td>
              <span :class="u.role === 'ADMIN' ? 'badge bg-danger' : 'badge bg-secondary'">
                {{ u.role }}
              </span>
            </td>
            <td>
              <button @click="editName(u)" class="btn btn-sm btn-outline-primary me-2">
                Name ändern
              </button>
              <button @click="deleteUser(u.id)" class="btn btn-sm btn-outline-danger">
                Löschen
              </button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="4" class="text-center italic">Keine Benutzer gefunden.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-dark {
  background-color: #212529;
}
</style>