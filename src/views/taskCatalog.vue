<script setup>
import TaskCard from '@/components/taskCard.vue';
import Button from '@/components/button.vue';
import { ref, onMounted } from 'vue';

const url = 'http://localhost:8081/api/task';
const tasks = ref([]);
const loadingError = ref(null);

onMounted(fetchTasks);

async function fetchTasks() {
  loadingError.value = null;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    tasks.value = await response.json();
  } catch (e) {
    console.error(e);
    loadingError.value = 'Fehler beim Laden der Aufgaben. Ist das Backend aktiv?';
  }
}
</script>

<template>

  <div class="dashboard-page container">
    <div class="row">

      <!-- Hauptbereich -->
      <main class="col-lg-9 kanban-area-wrapper p-0">
        <div class="dashboard-wrapper p-4 p-md-5">

          <!-- Header wie Dashboard -->
          <div class="d-flex justify-content-between align-items-center mb-4 dashboard-header-container">
            <h2 class="fw-bold mb-0 dashboard-title">Aufgabenübersicht</h2>

            <div class="d-flex flex-wrap align-items-center">
              <Button variant="primary" class="me-2 mb-2 mb-sm-0 btn-custom-blue">
                Projekt erstellen
              </Button>

              <Button variant="primary" class="me-2 mb-2 mb-sm-0 btn-custom-blue">
                Neue Aufgabe
              </Button>

              <Button variant="success" class="mb-2 mb-sm-0 btn-custom-green">
                Rechnung erstellen
              </Button>
            </div>
          </div>

          <!-- Fehler -->
          <div v-if="loadingError" class="alert alert-danger">
            {{ loadingError }}
          </div>

          <!-- Keine Tasks -->
          <div v-else-if="tasks.length === 0" class="alert alert-info">
            Keine Aufgaben gefunden.
          </div>

          <!-- Aufgabenliste -->
          <div class="kanban-area">
            <div class="row g-4">
              <div v-for="task in tasks" :key="task.id" class="col-lg-4 col-md-6">
                <TaskCard :task="task" />
              </div>
            </div>
          </div>

        </div>
      </main>

      <!-- Unsichtbare Sidebar für Layout -->
      <aside class="col-lg-3 sidebar p-4 invisible-sidebar"></aside>

    </div>
  </div>

</template>

<style scoped>
/* IDENTISCH zu Dashboard */
.dashboard-page.container {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.dashboard-wrapper {
  font-family: 'Montserrat', sans-serif;
  background: rgba(255, 255, 255, 0.53);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 0 40px rgba(0,0,0,0.1);
  min-height: 70vh;
}

.kanban-area-wrapper {
  padding-right: 0 !important;
}

.kanban-area {
  background: none;
  padding-right: 2rem !important;
}

.dashboard-header-container {
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.dashboard-title {
  color: #0d6efd !important;
  font-weight: 700;
}

.btn-custom-blue {
  background-color: #007BFF !important;
  border-color: #007BFF !important;
  color: white !important;
}

.btn-custom-green {
  background-color: #19C059 !important;
  border-color: #19C059 !important;
  color: white !important;
}

/* Unsichtbare Sidebar für gleiches Layout */
.invisible-sidebar {
  opacity: 0;
  pointer-events: none;
}
</style>
