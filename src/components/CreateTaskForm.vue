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
  user: ''
});

const errors = ref({}); 
const showErrorMessage = ref(false); 
const staffList = ref([]);

onMounted(async () => {
  try {
    const token = await getAccessTokenSilently();
    staffList.value = await getAllUsers(token);
  } catch (e) {
    console.error("Fehler beim Laden der Mitarbeiterliste", e);
  }
});


function validateForm() {
  errors.value = {};
  let isValid = true;

  if (!form.value.title || form.value.title.trim().length < 3) {
    errors.value.title = "Der Titel muss mindestens 3 Zeichen lang sein.";
    isValid = false;
  }
  
  if (!form.value.duration || form.value.duration <= 0) {
    errors.value.duration = "Bitte geben Sie eine gültige Dauer in Stunden an.";
    isValid = false;
  }

  if (!form.value.user) {
    errors.value.user = "Bitte wählen Sie eine Person aus.";
    isValid = false;
  }

  showErrorMessage.value = !isValid;
  return isValid;
}

function submitForm() {
  if (validateForm()) {
    // Senden der Daten nur bei Erfolg
    emit('submit', { ...form.value });
    // Reset des Formulars und der Fehler-Stati
    form.value = { title: '', description: '', status: 'Offen', dueDate: '', duration: '', user: '' };
    errors.value = {};
    showErrorMessage.value = false;
  }
  // KEIN alert() mehr hier – die Rückmeldung erfolgt rein visuell
}

defineExpose({ submitForm });
</script>

<template>
  <div class="create-task-form">
    <div v-if="showErrorMessage" class="alert alert-danger mb-4 py-2 border-0 shadow-sm">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      Bitte korrigieren Sie die markierten Felder.
    </div>

    <form @submit.prevent="submitForm" novalidate>
      <div class="mb-3">
        <label class="form-label fw-bold small text-uppercase text-muted">Titel *</label>
        <input 
          v-model="form.title" 
          type="text" 
          class="form-control" 
          :class="{'is-invalid': errors.title}"
          placeholder="Titel eingeben" 
        />
        <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold small text-uppercase text-muted">Beschreibung</label>
        <textarea v-model="form.description" class="form-control" rows="3"></textarea>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-bold small text-uppercase text-muted">Status</label>
          <select v-model="form.status" class="form-select">
            <option>Offen</option>
            <option>In Bearbeitung</option>
            <option>Erledigt</option>
          </select>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-bold small text-uppercase text-muted">Fälligkeitsdatum</label>
          <input v-model="form.dueDate" type="date" class="form-control" />
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-bold small text-uppercase text-muted">Geschätzte Dauer (Std) *</label>
          <input 
            v-model="form.duration" 
            type="number" 
            class="form-control" 
            :class="{'is-invalid': errors.duration}"
            step="0.5" 
          />
          <div v-if="errors.duration" class="invalid-feedback">{{ errors.duration }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-bold small text-uppercase text-muted">Zuweisen an *</label>
          <select 
            v-model="form.user" 
            class="form-select" 
            :class="{'is-invalid': errors.user}"
          >
            <option value="" disabled>Bitte wählen...</option>
            <option v-for="u in staffList" :key="u.id" :value="u.name">
              {{ u.name }}
            </option>
          </select>
          <div v-if="errors.user" class="invalid-feedback">{{ errors.user }}</div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.invalid-feedback {
  font-size: 0.8rem;
}

.form-label {
  letter-spacing: 0.5px;
}

.alert {
  border-left: 4px solid #dc3545 !important;
}
</style>