<script setup>
import { ref, watch, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue'; // Auth Hook importieren
import TaskComments from '@/components/TaskComments.vue';
import { getTaskById } from '@/api/taskService.js'; // Service importieren

const props = defineProps({
  taskId: [Number, String],
  backend: Boolean
});

const emit = defineEmits(['save', 'delete']);
const { getAccessTokenSilently } = useAuth0(); // Token abrufen

const title = ref('');
const user = ref('');
const startDate = ref('');
const endDate = ref('');
const duration = ref('');
const status = ref('');
const loading = ref(false);

// Lädt die Daten, sobald sich die TaskID ändert oder die Komponente montiert wird
async function loadTaskData() {
  if (!props.taskId) return;

  if (props.backend) {
    loading.value = true;
    try {
      const token = await getAccessTokenSilently();
      const data = await getTaskById(token, props.taskId);
      mapTask(data);
    } catch (e) {
      console.error("Fehler beim Laden der Aufgabe:", e);
    } finally {
      loading.value = false;
    }
  } else {
    loadTaskDummy();
  }
}

function loadTaskDummy() {
  const dummy = JSON.parse(localStorage.getItem('dummyTasks')) || [];
  const task = dummy.find(t => t.id == props.taskId);
  if (task) mapTask(task);
}

function mapTask(data) {
  title.value = data.title || '';
  user.value = data.user || '';
  // Datum formatieren (YYYY-MM-DD), falls API ISO-String liefert
  startDate.value = data.startDate ? data.startDate.split('T')[0] : '';
  endDate.value = data.endDate ? data.endDate.split('T')[0] : '';
  duration.value = data.duration || '';
  status.value = data.status || 'In Bearbeitung';
}

// Watcher: Reagiert auf Änderung der taskId 
watch(() => props.taskId, async (newId) => {
  if (newId) {
    // Leert Datenfelder
    title.value = '';
    user.value = '';
    await loadTaskData();
  }
}, { immediate: true });

function save() {
  if (
    !title.value ||
    !duration.value ||
    !status.value
  ) {
    alert("Bitte die Pflichtfelder (Titel, Dauer, Status) ausfüllen!");
    return;
  }

  emit('save', {
    title: title.value,
    user: user.value,
    startDate: startDate.value,
    endDate: endDate.value,
    duration: Number(duration.value),
    status: status.value
  });
}

function del() {
  emit('delete');
}

defineExpose({ save });
</script>

<template>
  <div v-if="loading" class="text-center py-4">
    <span class="spinner-border spinner-border-sm text-primary" role="status"></span>
    <span class="ms-2">Lade Daten...</span>
  </div>
  
  <div v-else>
    <label class="form-label">Titel</label>
    <input class="form-control" v-model="title" />

    <label class="form-label mt-3">Zugewiesen an</label>
    <input class="form-control" v-model="user" />

    <label class="form-label mt-3">Status</label>
    <select class="form-control" v-model="status">
      <option value="Erledigt">Erledigt</option>
      <option value="In Bearbeitung">In Bearbeitung</option>
      <option value="Review">Review</option>
    </select>

    <label class="form-label mt-3">Startdatum</label>
    <input type="date" class="form-control" v-model="startDate" />

    <label class="form-label mt-3">Dauer in Stunden</label>
    <input type="number" class="form-control" v-model="duration" />

    <label class="form-label mt-3">Enddatum</label>
    <input type="date" class="form-control" v-model="endDate" />

    <div class="mt-4">
      <TaskComments :taskId="props.taskId" />
    </div>
  </div>
</template>