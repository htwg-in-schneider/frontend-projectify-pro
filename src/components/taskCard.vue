<script setup>
const props = defineProps({
  task: Object
})

const emit = defineEmits(['edit'])
</script>

<template>
  <div 
    class="card mb-3 shadow-sm border-0 project-card" 
    @click="$emit('edit', task.id)"
  >
    <div 
      class="card-body border-start border-4" 
      :class="{
        'border-success': task.status === 'Erledigt', 
        'border-primary': task.status === 'In Bearbeitung', 
        'border-warning': task.status === 'Offen'
      }"
    >
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="card-title fw-bold mb-0 text-dark">{{ task.title }}</h6>
      </div>
      
      <p v-if="task.description" class="card-text mt-2 text-muted small mb-2">
        {{ task.description }}
      </p>
      
      <div v-if="task.startDate || task.endDate" class="mt-2 text-muted small">
        <i class="bi bi-calendar-event me-1"></i>
        {{ task.startDate || '...' }} bis {{ task.endDate || '...' }}
      </div>
      
      <div class="d-flex justify-content-between align-items-center mt-2">
        <span class="small text-muted" style="font-size: 0.75rem;">
          👤 {{ task.user || task.assignedTo || task.assignedUser || 'Nicht zugewiesen' }}
        </span>
        <span v-if="task.duration" class="small text-muted" style="font-size: 0.75rem;">
          ⏱ {{ task.duration }} Std.
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  background: white;
  border-radius: 8px;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.12) !important;
}

.border-warning { border-color: #ffc107 !important; } 
.border-primary { border-color: #0d6efd !important; } 
.border-success { border-color: #198754 !important; } 

.project-card {
  user-select: none;
}
</style>