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
    (u.name && u.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchQuery.value.toLowerCase()))
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

// --- NAME ÄNDERN ---
async function editName(user) {
  const newName = prompt(`Neuen Namen für ${user.email} eingeben:`, user.name)
  if (newName === null || newName.trim() === "" || newName === user.name) return 
  await updateUser(user, { name: newName }, 'Name erfolgreich aktualisiert')
}

// --- E-MAIL ÄNDERN ---
async function editEmail(user) {
  const newEmail = prompt(`Neue E-Mail für ${user.name} eingeben:`, user.email)
  if (newEmail === null || newEmail.trim() === "" || newEmail === user.email) return 
  await updateUser(user, { email: newEmail }, 'E-Mail erfolgreich aktualisiert')
}

// --- STATUS (ROLLE) ÄNDERN ---
async function toggleRole(user) {
  const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
  if (!confirm(`Soll der Nutzer "${user.name}" wirklich die Rolle "${newRole}" erhalten?`)) return
  await updateUser(user, { role: newRole }, `Status erfolgreich auf ${newRole} geändert`)
}

// --- ZENTRALE UPDATE-FUNKTION ---
async function updateUser(user, changes, successMessage) {
  try {
    const token = await getAccessTokenSilently()
    
    // KORREKTUR: 'oauthId' hinzufügen!
    // Wir bauen das Objekt explizit zusammen, um 'createdAt'/'updatedAt' (Timestamps)
    // und 'password' wegzulassen, aber ALLE Pflichtfelder mitzusenden.
    const payload = {
      id: user.id,
      oauthId: user.oauthId, // <--- WICHTIG: Identifikation darf nicht fehlen
      name: changes.name !== undefined ? changes.name : user.name,
      email: changes.email !== undefined ? changes.email : user.email,
      role: changes.role !== undefined ? changes.role : user.role
    }

    const response = await fetch(`${baseUrl}/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      alert(successMessage)
      await fetchUsers()
    } else {
      // Fehlertext auslesen für besseres Debugging
      const errText = await response.text()
      console.error('Update Fehler Backend:', errText)
      alert(`Fehler beim Aktualisieren: ${response.status}\nServer-Meldung: ${errText}`)
    }
  } catch (e) {
    console.error("Netzwerkfehler:", e)
    alert('Verbindung zum Server fehlgeschlagen')
  }
}

// --- LÖSCHEN FUNKTION ---
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
    alert("Löschen fehlgeschlagen")
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
            <th>Status (Rolle)</th>
            <th style="min-width: 350px;">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in filteredUsers" :key="u.id">
            <td class="align-middle">{{ u.name }}</td>
            <td class="text-muted align-middle">{{ u.email }}</td>
            <td class="align-middle">
              <span :class="u.role === 'ADMIN' ? 'badge bg-danger' : 'badge bg-secondary'">
                {{ u.role }}
              </span>
            </td>
            <td class="align-middle">
              <button @click="editName(u)" class="btn btn-sm btn-outline-primary me-2 mb-1">
                Name ändern
              </button>
              <button @click="editEmail(u)" class="btn btn-sm btn-outline-secondary me-2 mb-1">
                E-Mail ändern
              </button>
              <button @click="toggleRole(u)" class="btn btn-sm btn-outline-warning me-2 mb-1">
                Status ändern
              </button>
              <button @click="deleteUser(u.id)" class="btn btn-sm btn-outline-danger mb-1">
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
.btn {
  white-space: nowrap;
}
.italic {
  font-style: italic;
  color: #6c757d;
}
</style>