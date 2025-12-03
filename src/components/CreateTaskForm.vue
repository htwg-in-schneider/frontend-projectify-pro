<script setup>
import { ref, defineExpose } from 'vue';

const emit = defineEmits(['submit']);

const title = ref('');
const user = ref('');
const startDate = ref('');
const endDate = ref('');
const duration = ref('');
const status = ref('In Bearbeitung');

function submitForm() {
  emit('submit', {
    title: title.value,
    user: user.value,
    startDate: startDate.value,
    endDate: endDate.value,
    duration: duration.value,
    status: status.value
  });
}

defineExpose({ submitForm });
</script>

<template>
  <form @submit.prevent="submitForm">

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

  </form>
</template>
