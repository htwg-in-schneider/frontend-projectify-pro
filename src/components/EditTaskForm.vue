<script setup>
import { ref, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';
import TaskComments from '@/components/TaskComments.vue';

const props = defineProps({
  taskId: Number,
  backend: Boolean
});

const emit = defineEmits(['save', 'delete']);

const title = ref('');
const user = ref('');
const startDate = ref('');
const endDate = ref('');
const duration = ref('');
const status = ref('');

async function loadTaskBackend() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${BASE_URL}/api/task/${props.taskId}`);
  const data = await res.json();
  mapTask(data);
}


function loadTaskDummy() {
  const dummy = JSON.parse(localStorage.getItem('dummyTasks')) || [];
  const task = dummy.find(t => t.id == props.taskId);
  if (task) mapTask(task);
}

function mapTask(data) {
  title.value = data.title;
  user.value = data.user;
  startDate.value = data.startDate;
  endDate.value = data.endDate;
  duration.value = data.duration;
  status.value = data.status;
}

onMounted(() => {
  if (props.backend) loadTaskBackend();
  else loadTaskDummy();
});

function save() {
  if (
    !title.value ||
    !user.value ||
    !startDate.value ||
    !endDate.value ||
    !duration.value ||
    !status.value
  ) {
    alert("Bitte alle Felder ausfüllen!");
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
  <div>
    <label class="form-label">Titel</label>
    <input class="form-control" v-model="title" />

    <label class="form-label mt-3">Zugewiesen an</label>
    <input class="form-control" v-model="user" />

    <label class="form-label mt-3">Status</label>
    <select class="form-control" v-model="status">
      <option>Erledigt</option>
      <option>In Bearbeitung</option>
      <option>Review</option>
    </select>

    <label class="form-label mt-3">Startdatum</label>
    <input type="date" class="form-control" v-model="startDate" />

    <label class="form-label mt-3">Dauer</label>
    <input class="form-control" v-model="duration" />

    <label class="form-label mt-3">Enddatum</label>
    <input type="date" class="form-control" v-model="endDate" />

    
    <TaskComments :taskId="props.taskId" />
  </div>
</template>
