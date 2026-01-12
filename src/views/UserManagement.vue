<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { getAllUsers } from '@/api/userService.js'

const { getAccessTokenSilently } = useAuth0()
const users = ref([])
const searchQuery = ref('')
const loading = ref(true)

const filteredUsers = computed(() => {
  return users.value.filter(u => 
    u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

async function fetchUsers() {
  try {
    const token = await getAccessTokenSilently()
    users.value = await getAllUsers(token)
  } catch (e) {
    console.error("Fehler beim Laden der Nutzer:", e)
  } finally {
    loading.value = false
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

    <div v-if="loading" class="text-center">
      <div class="spinner-border"></div>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover table-bordered shadow-sm bg-white">
        <thead class="table-primary">
          <tr>
            <th>Name</th>
            <th>E-Mail</th>
            <th>Rolle</th>
            <th>OAuth ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in filteredUsers" :key="u.id">
            <td>{{ u.name }}</td>
            <td>{{ u.email }}</td>
            <td>
              <span :class="u.role === 'ADMIN' ? 'badge bg-danger' : 'badge bg-info'">
                {{ u.role }}
              </span>
            </td>
            <td class="small text-muted">{{ u.oauthId }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>