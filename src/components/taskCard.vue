<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="card mb-3 task-card shadow-sm">
    <div class="card-body">

      <!-- Titel -->
      <h5 class="card-title">{{ task.title }}</h5>

      <!-- Zugewiesen an -->
      <p class="card-text small text-muted mb-2">
        {{ task.assignedTo }} |
      </p>

      <!-- Details -->
      <div class="task-details small">
        <p class="mb-0">Start: {{ task.startDate }}</p>
        <p class="mb-0">Ende: {{ task.endDate }}</p>
        <p class="mb-0">Dauer: {{ task.duration }} Tage</p>
      </div>

      <!-- Kommentar-Icon -->
      <div class="comment-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-text" viewBox="0 0 16 16">
          <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.303 1.099c-.339.623.242 1.018.808.576A8.996 8.996 0 0 0 8 14c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.619zm-.881-.276A9.09 9.09 0 0 0 1 7c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7c-.297 0-.585-.011-.868-.031a1 1 0 0 1-.686-.178l-.254-.238a2 2 0 0 0-1.282-.445H4.498a1 1 0 0 1-.84-.535z"/>
          <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM4 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 4 8z"/>
        </svg>
      </div>

    </div>
  </div>
</template>

<style scoped>
.task-card {
  position: relative;
  border-left: 3px solid var(--bs-info, #0dcaf0); 
}

.comment-icon {
  position: absolute;
  bottom: 15px;
  right: 15px;
  color: #aaa; 
}
</style>
