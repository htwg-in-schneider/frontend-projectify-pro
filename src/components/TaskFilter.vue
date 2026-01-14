<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(["filter-change"]);

const title = ref("");
const status = ref("");

// status backend
const statusOptions = [
  { value: "", label: "Alle" },
  { value: "In Bearbeitung", label: "In Bearbeitung" },
  { value: "Erledigt", label: "Erledigt" },
  { value: "Review", label: "Review" },
];

function applyFilter() {
  emit("filter-change", {
    title: title.value,
    status: status.value
  });
}
</script>

<template>
  <div class="card p-3 mb-4 shadow-sm">

    <div class="row g-3">

      <!-- title searching -->
      <div class="col-md-6">
        <label class="form-label">Titel suchen</label>
        <input 
          type="text" 
          v-model="title" 
          class="form-control" 
          placeholder="Titel eingeben..."
          @input="applyFilter"
        >
      </div>

      <!-- status dropdown -->
      <div class="col-md-6">
        <label class="form-label">Status</label>
        <select 
          class="form-select" 
          v-model="status" 
          @change="applyFilter"
        >
          <option 
            v-for="opt in statusOptions" 
            :key="opt.value" 
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>

    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 0.75rem;
}
</style>
