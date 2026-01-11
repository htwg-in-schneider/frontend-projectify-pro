<script setup>
// Props der Task-Karte
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

// Event an Parent senden, wenn Karte geklickt wird
const emit = defineEmits(["click"]);
</script>

<template>
  <!-- Ganze Karte klickbar -->
  <div class="card mb-3 task-card shadow-sm" @click="emit('click')">
    <div class="card-body">

      <!-- Titel -->
      <h5 class="card-title">{{ task.title }}</h5>

      <!-- Zugewiesen an -->
      <p class="card-text small text-muted mb-2">
        {{ task.user }}
      </p>

      <!-- Details -->
      <div class="task-details small">
        <p class="mb-0">Start: {{ task.startDate }}</p>
        <p class="mb-0">Ende: {{ task.endDate }}</p>
        <p class="mb-0">Dauer: {{ task.duration }} Stunden</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.task-card {
  position: relative;
  border-left: 3px solid var(--bs-info, #0dcaf0);
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
}

.task-card:hover {
  transform: scale(1.01);
}

.comment-icon {
  position: absolute;
  bottom: 15px;
  right: 15px;
  color: #aaa;
}
</style>
