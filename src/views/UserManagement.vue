<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { getAllUsers } from '@/api/userService.js'

const { getAccessTokenSilently } = useAuth0()
const users = ref([])
const searchQuery = ref('')
const loading = ref(true)

// API URL out of .env
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

// --- NAME change ---
async function editName(user) {
  const newName = prompt(`Neuen Namen für ${user.email} eingeben:`, user.name)
  
  if (newName === null || newName.trim() === "" || newName === user.name) {
    return 
  }

  await updateUser(user, { name: newName }, 'Name erfolgreich aktualisiert')
}

// --- E-MAIL change ---
async function editEmail(user) {
  const newEmail = prompt(`Neue E-Mail für ${user.name} eingeben:`, user.email)
  
  if (newEmail === null || newEmail.trim() === "" || newEmail === user.email) {
    return 
  }

  await updateUser(user, { email: newEmail }, 'E-Mail erfolgreich aktualisiert')
}

async function toggleRole(user) {
  // switch between ADMIN and REGULAR
  const newRole = user.role === 'ADMIN' ? 'REGULAR' : 'ADMIN'
  
  if (!confirm(`Soll der Nutzer "${user.name}" wirklich die Rolle "${newRole}" erhalten?`)) {
    return
  }

  await updateUser(user, { role: newRole }, `Status erfolgreich auf ${newRole} geändert`)
}
// --- update function  ---
async function updateUser(user, changes, successMessage) {
  try {
    const token = await getAccessTokenSilently()
    
    const payload = { ...user }

    if (changes.name) payload.name = changes.name
    if (changes.email) payload.email = changes.email
    if (changes.role) payload.role = changes.role

    delete payload.createdAt
    delete payload.updatedAt
    delete payload.created_at
    delete payload.updated_at
    delete payload.lastLogin

    // debugging f12
    console.log("Sende Payload an Backend:", payload)

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
      const errText = await response.text()
      console.error('Update Fehler Backend:', errText)
      // Versuche JSON zu parsen für schönere Fehlermeldung
      try {
          const errJson = JSON.parse(errText);
          alert(`Fehler 400: Validierung fehlgeschlagen.\nPfad: ${errJson.path}\nFehler: ${errJson.error}`);
      } catch (e) {
          alert(`Fehler beim Aktualisieren: ${response.status}\n${errText}`)
      }
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