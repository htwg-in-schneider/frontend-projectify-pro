<script setup>
import TaskCard from '@/components/taskCard.vue';
import Button from '@/components/button.vue';
import TaskModal from '@/components/TaskModal.vue';
import CreateTaskForm from '@/components/CreateTaskForm.vue';
import EditTaskForm from '@/components/EditTaskForm.vue';
import TaskFilter from '@/components/TaskFilter.vue';

import { ref, onMounted } from 'vue';

/* SERVICE IMPORT */
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
} from '@/api/taskService.js';

const tasks = ref([]);
const loadingError = ref(null);

const showCreate = ref(false);
const showEdit = ref(false);
const selectedTaskId = ref(null);

const editForm = ref(null);
const createForm = ref(null);

let createFormBuffer = null;

/* FILTER STATES */
const filterTitle = ref("");
const filterStatus = ref("");

onMounted(loadTasks);

/* LOAD WITH FILTERS */
async function loadTasks() {
  loadingError.value = null;

  try {
    tasks.value = await getAllTasks(filterTitle.value, filterStatus.value);
  } catch (e) {
    console.error(e);
    loadingError.value = 'Fehler beim Laden der Aufgaben. Ist das Backend aktiv?';
  }
}

/* FILTER EVENT */
function onFilterChange(filter) {
  filterTitle.value = filter.title;
  filterStatus.value = filter.status;
  loadTasks();
}

/* POPUP ÖFFNEN */
function openCreateTask() {
  showCreate.value = true;
}

function openEditTask(id) {
  selectedTaskId.value = id;
  showEdit.value = true;
}

/* CREATE */
function onCreateFormInput(body) {
  createFormBuffer = body;
}

async function submitCreateTask() {

  createForm.value?.submitForm();

  if (!createFormBuffer) {
    alert("Bitte Formular ausfüllen!");
    return;
  }

  await createTask(createFormBuffer);
  showCreate.value = false;
  createFormBuffer = null;
  loadTasks();
}

/* SAVE */
async function onSaveTask(body) {
  await updateTask(selectedTaskId.value, body);
  showEdit.value = false;
  loadTasks();
}

/* DELETE */
async function onDeleteTask() {
  await deleteTask(selectedTaskId.value);
  showEdit.value = false;
  loadTasks();
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

              <Button 
                variant="primary" 
                class="me-2 mb-2 mb-sm-0 btn-custom-blue"
                @click="openCreateTask"
              >
                Neue Aufgabe
              </Button>

              <Button variant="success" class="mb-2 mb-sm-0 btn-custom-green">
                Rechnung erstellen
              </Button>
            </div>
          </div>

          <!-- FILTER-KOMPONENTE -->
          <TaskFilter @filter-change="onFilterChange" />

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
              <div 
                v-for="task in tasks" 
                :key="task.id" 
                class="col-lg-4 col-md-6"
              >
                <TaskCard 
                  :task="task"
                  @click="openEditTask(task.id)"
                />
              </div>
            </div>
          </div>

        </div>
      </main>

      <!-- Unsichtbare Sidebar -->
      <aside class="col-lg-3 sidebar p-4 invisible-sidebar"></aside>

    </div>
  </div>


  <!-- CREATE MODAL -->
  <TaskModal 
    :show="showCreate"
    title="Neue Aufgabe"
    @close="showCreate = false"
  >

    <CreateTaskForm ref="createForm" @submit="onCreateFormInput" />

    <template #footer>
      <button class="btn btn-secondary" @click="showCreate = false">Abbrechen</button>
      <button class="btn btn-success" @click="submitCreateTask">Erstellen</button>
    </template>

  </TaskModal>


  <!-- EDIT MODAL -->
  <TaskModal
    :show="showEdit"
    title="Aufgabe bearbeiten"
    @close="showEdit = false"
  >

    <EditTaskForm 
      ref="editForm"
      :taskId="selectedTaskId"
      :backend="true"
      @save="onSaveTask"
      @delete="onDeleteTask"
    />

    <template #footer>
      <button class="btn btn-danger" @click="onDeleteTask()">Löschen</button>
      <button class="btn btn-success" @click="$refs.editForm.save()">Speichern</button>
    </template>

  </TaskModal>

</template>




<style scoped>
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

.invisible-sidebar {
  opacity: 0;
  pointer-events: none;
}
</style>
