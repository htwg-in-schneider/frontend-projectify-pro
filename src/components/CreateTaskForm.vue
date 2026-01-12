<script setup>
import { ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { getAllUsers } from '@/api/userService.js';

const emit = defineEmits(['submit']);
const { getAccessTokenSilently } = useAuth0();

const form = ref({
  title: '',
  description: '',
  status: 'Offen',
  dueDate: '',
  duration: '',
  user: '' // KORRIGIERT: 'user' statt 'assignedTo'
});

const staffList = ref([]);

onMounted(async () => {
  try {
    const token = await getAccessTokenSilently();
    staffList.value = await getAllUsers(token);
  } catch (e) {
    console.error("Fehler beim Laden der Mitarbeiterliste", e);
  }
});

function submitForm() {
  // Wir senden eine Kopie der Daten
  emit('submit', { ...form.value });
  // Reset
  form.value = { title: '', description: '', status: 'Offen', dueDate: '', duration: '', user: '' };
}

defineExpose({ submitForm });
</script>

<template>
  <div>
    <div class="mb-3">
      <label class="form-label">Titel *</label>
      <input v-model="form.title" type="text" class="form-control" placeholder="Titel eingeben" required />
    </div>

    <div class="mb-3">
      <label class="form-label">Beschreibung</label>
      <textarea v-model="form.description" class="form-control" rows="3"></textarea>
    </div>

    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Status</label>
        <select v-model="form.status" class="form-select">
          <option>Offen</option>
          <option>In Bearbeitung</option>
          <option>Erledigt</option>
        </select>
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label">Fälligkeitsdatum</label>
        <input v-model="form.dueDate" type="date" class="form-control" />
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Geschätzte Dauer (Std)</label>
        <input v-model="form.duration" type="number" class="form-control" step="0.5" />
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label">Zuweisen an</label>
        <select v-model="form.user" class="form-select">
          <option value="" disabled>Bitte wählen...</option>
          <option v-for="u in staffList" :key="u.id" :value="u.name">
            {{ u.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>