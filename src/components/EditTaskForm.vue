<script setup>
import { ref, watch, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { getTaskById, getComments, addComment } from '@/api/taskService.js';
import { getAllUsers } from '@/api/userService.js';

const props = defineProps({
  taskId: [Number, String],
  backend: Boolean
});

const emit = defineEmits(['save', 'delete']);
const { getAccessTokenSilently, user: authUser } = useAuth0();

const loading = ref(false);
const commentsLoading = ref(false);
const newComment = ref('');


const errors = ref({});

// Formular-Daten
const form = ref({
  title: '',
  user: '',
  status: 'In Bearbeitung',
  startDate: '',
  endDate: '',
  duration: 0,
  projectId: null 
});

const comments = ref([]);
const staffList = ref([]);

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
}

onMounted(async () => {
  try {
    const token = await getAccessTokenSilently();
    staffList.value = await getAllUsers(token);
  } catch (e) {
    console.error("Fehler beim Laden der Mitarbeiter:", e);
  }
});

async function loadData() {
  if (!props.taskId) return;
  
  loading.value = true;
  errors.value = {}; 
  try {
    const token = await getAccessTokenSilently();
    const task = await getTaskById(token, props.taskId);
    form.value = {
      title: task.title || '',
      user: task.user || '',
      status: task.status || 'In Bearbeitung',
      startDate: formatDate(task.startDate),
      endDate: formatDate(task.endDate),
      duration: task.duration || 0,
      projectId: task.projectId 
    };
    await fetchComments(token);
  } catch (e) {
    console.error("Fehler beim Laden:", e);
  } finally {
    loading.value = false;
  }
}

async function fetchComments(token) {
  commentsLoading.value = true;
  try {
    const data = await getComments(token, props.taskId);
    comments.value = data || [];
  } catch (e) {
    console.error(e);
  } finally {
    commentsLoading.value = false;
  }
}

watch(() => props.taskId, (newId) => {
  if (newId) loadData();
}, { immediate: true });

async function submitComment() {
  if (!newComment.value.trim()) return;
  try {
    const token = await getAccessTokenSilently();
    let currentUserName = authUser.value?.name || authUser.value?.nickname || 'Unbekannt';
    await addComment(token, {
      userName: currentUserName, 
      text: newComment.value,
      task: { id: props.taskId }
    });
    newComment.value = '';
    await fetchComments(token);
  } catch (e) {
    alert("Kommentar konnte nicht gesendet werden.");
  }
}


function validateForm() {
  errors.value = {};
  
  if (!form.value.title || form.value.title.trim().length < 3) {
    errors.value.title = "Der Titel muss mindestens 3 Zeichen lang sein.";
  }
  
  if (form.value.duration === null || form.value.duration === undefined || form.value.duration === '') {
    errors.value.duration = "Bitte geben Sie eine Dauer an.";
  } else if (parseFloat(form.value.duration) < 0) {
    errors.value.duration = "Die Dauer kann nicht negativ sein.";
  }

  if (!form.value.status) {
    errors.value.status = "Bitte wählen Sie einen Status aus.";
  }

  return Object.keys(errors.value).length === 0;
}

function save() {
  if (validateForm()) {
    emit('save', { ...form.value });
  }
}

defineExpose({ save });
</script>

<template>
  <div v-if="loading" class="text-center py-4">
    <span class="spinner-border text-primary"></span>
  </div>

  <div v-else>
    <form @submit.prevent="save" novalidate>
      <div class="mb-3">
        <label class="form-label fw-bold">Titel</label>
        <input 
          class="form-control" 
          :class="{'is-invalid': errors.title}" 
          v-model="form.title" 
          placeholder="Aufgaben Titel" 
        />
        <div class="invalid-feedback">{{ errors.title }}</div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label fw-bold">Zugewiesen an</label>
          <select class="form-select" v-model="form.user">
            <option value="">Nicht zugewiesen</option>
            <option v-for="u in staffList" :key="u.id" :value="u.name">
              {{ u.name }}
            </option>
          </select>
        </div>
        
        <div class="col-md-6">
          <label class="form-label fw-bold">Status</label>
          <select 
            class="form-select" 
            :class="{'is-invalid': errors.status}" 
            v-model="form.status"
          >
            <option>Erledigt</option>
            <option>In Bearbeitung</option>
            <option>Offen</option>
          </select>
          <div class="invalid-feedback">{{ errors.status }}</div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-4">
          <label class="form-label fw-bold">Startdatum</label>
          <input type="date" class="form-control" v-model="form.startDate" />
        </div>
        <div class="col-md-4">
          <label class="form-label fw-bold">Enddatum</label>
          <input type="date" class="form-control" v-model="form.endDate" />
        </div>
        <div class="col-md-4">
          <label class="form-label fw-bold">Dauer in Stunden</label>
          <input 
            type="number" 
            step="0.5" 
            class="form-control" 
            :class="{'is-invalid': errors.duration}" 
            v-model="form.duration" 
          />
          <div class="invalid-feedback">{{ errors.duration }}</div>
        </div>
      </div>
    </form>

    <hr class="my-4" />

    <div>
      <h5 class="fw-bold mb-3">Kommentare</h5>
      <div class="comment-list mb-3" v-if="comments.length > 0">
        <div v-for="c in comments" :key="c.id" class="card mb-2 bg-light border-0">
          <div class="card-body p-2">
            <div class="fw-bold small text-primary">{{ c.userName }}</div>
            <div class="text-dark">{{ c.text }}</div>
          </div>
        </div>
      </div>
      <div v-else class="text-muted mb-3 fst-italic">Keine Kommentare vorhanden.</div>

      <div class="input-group">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Kommentar schreiben..." 
          v-model="newComment"
          @keyup.enter="submitComment"
        />
        <button class="btn btn-primary" type="button" @click="submitComment">Senden</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 10px;
  background: white;
}
</style>