<template>
  <div class="dashboard-page container">
    <div class="row">

      <!-- Hauptbereich -->
      <main class="col-lg-9 kanban-area-wrapper p-0">
        <div class="dashboard-wrapper p-4 p-md-5">
          <div class="kanban-area">

            <!-- HEADER -->
            <div class="d-flex justify-content-between align-items-center mb-4 dashboard-header-container">
              <h2 class="fw-bold mb-0 dashboard-title">Projekt Dashboard</h2>

              <div class="d-flex flex-wrap align-items-center">
                <Button 
                  variant="primary" 
                  class="me-2 mb-2 mb-sm-0 btn-custom-blue"
                  @click="openCreateProject"
                >
                  Projekt erstellen
                </Button>

                <!-- HIER kommt der isAdmin Button rein -->
                <Button
                  v-if="isAdmin"
                  variant="primary"
                  class="me-2 mb-2 mb-sm-0 btn-custom-blue"
                  @click="openCreateTask"
                >
                  Aufgabe erstellen
                </Button>

              <Button 
                  variant="success" 
                  class="mb-2 mb-sm-0 btn-custom-green"
                  @click="calculateInvoice"
                >
                  Rechnung erstellen
              </Button>

              </div>
            </div>

            <!-- Optional: Fehleranzeige -->
            <div v-if="loadingError" class="alert alert-danger">
              {{ loadingError }}
            </div>

            <!-- KANBAN -->
            <div class="row g-4 kanban-container">

              <div class="col-md-4">
                <h4 class="mb-3 kanban-header">Erledigt</h4>
                <div class="kanban-column">
                  <TaskCard
                    v-for="task in filteredTasks?.Erledigt"
                    :key="task.id"
                    :task="task"
                    @click="openEditTask(task.id)"
                  />
                </div>
              </div>

              <div class="col-md-4">
                <h4 class="mb-3 kanban-header">In Bearbeitung</h4>
                <div class="kanban-column">
                  <TaskCard
                    v-for="task in filteredTasks?.['In Bearbeitung']"
                    :key="task.id"
                    :task="task"
                    @click="openEditTask(task.id)"
                  />
                </div>
              </div>

              <div class="col-md-4">
                <h4 class="mb-3 kanban-header">Review</h4>
                <div class="kanban-column">
                  <TaskCard
                    v-for="task in filteredTasks?.Review"
                    :key="task.id"
                    :task="task"
                    @click="openEditTask(task.id)"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <!-- SIDEBAR -->
      <aside class="col-lg-3 sidebar p-4">
        <div class="sidebar-block mb-5">
          <h4 class="d-flex justify-content-between align-items-center sidebar-header">
            Mitarbeiter <button class="btn btn-sm btn-link text-primary">+</button>
          </h4>
          <ul class="list-unstyled staff-list">
            <li v-for="name in staff || []" :key="name">{{ name }}</li>
          </ul>
        </div>

        <div class="sidebar-block">
          <h4 class="d-flex justify-content-between align-items-center sidebar-header">
            Projekte <button class="btn btn-sm btn-link text-primary">+</button>
          </h4>
          <ul class="list-unstyled project-list">
            <li
              v-for="project in projects || []"
              :key="project.name"
              :class="{ active: project.active }"
            >
              <a href="#" class="text-decoration-none">{{ project.name }}</a>
            </li>
          </ul>
        </div>
      </aside>

    </div>

                         <!-- HIER unten kommen die TaskModals rein -->

    <!-- POPUP: Neue Aufgabe (ADMIN) -->
    <TaskModal :show="showCreate" title="Neue Aufgabe" @close="showCreate = false">
      <CreateTaskForm ref="createForm" @submit="onCreateFormInput" />

      <template #footer>
        <button class="btn btn-secondary" @click="showCreate = false">Abbrechen</button>
        <button class="btn btn-success" @click="submitCreateTask">Erstellen</button>
      </template>
    </TaskModal>

    <!-- POPUP: Aufgabe bearbeiten (ADMIN) -->
    <TaskModal :show="showEdit" title="Aufgabe bearbeiten" @close="showEdit = false">
      <EditTaskForm
        ref="editForm"
        :taskId="selectedTaskId"
        :backend="true"
        @save="saveTask"
        @delete="deleteTaskById"
      />

      <template #footer>
        <button class="btn btn-danger" @click="deleteTaskById">Löschen</button>
        <button class="btn btn-success" @click="editForm?.save()">Speichern</button>
      </template>
    </TaskModal>

    <!-- POPUP: Neues Projekt (ADMIN) -->

    <TaskModal :show="showCreateProject" title="Neues Projekt" @close="showCreateProject = false">
      <CreateTaskForm ref="createProjectForm" @submit="onProjectFormInput" />

      <template #footer>
        <button class="btn btn-secondary" @click="showCreateProject = false">Abbrechen</button>
        <button class="btn btn-success" @click="submitCreateProject">Erstellen</button>
      </template>
    </TaskModal>

    <TaskModal :show="showInvoice" title="Rechnung erstellen" @close="showInvoice = false">
      <div v-if="invoiceData.items.length > 0">
        <p class="text-muted mb-3">für alle Aufgaben die Bereits erledigt sind <strong>"Erledigt"</strong> (Stundensatz: 100€)</p>
        <ul class="list-group mb-4">
          <li v-for="item in invoiceData.items" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div class="fw-bold">{{ item.title }}</div>
              <small class="text-muted">Dauer: {{ item.duration }} Std.</small>
            </div>
            <span class="badge bg-primary rounded-pill">{{ item.cost }} €</span>
          </li>
        </ul>
        <div class="d-flex justify-content-end align-items-center border-top pt-3">
          <h4 class="mb-0 me-3">Gesamtbetrag:</h4>
          <h3 class="fw-bold text-success mb-0">{{ invoiceData.total }} €</h3>
        </div>
      </div>
      <div v-else class="alert alert-info">
        Keine erledigten Aufgaben für die Rechnungsstellung gefunden.
      </div>

      <template #footer>
        <button class="btn btn-secondary" @click="showInvoice = false">Abbrechen</button>
      </template>
    </TaskModal>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";

import TaskCard from "@/components/taskCard.vue";
import Button from "@/components/button.vue";
import TaskModal from "@/components/TaskModal.vue";
import CreateTaskForm from "@/components/CreateTaskForm.vue";
import EditTaskForm from "@/components/EditTaskForm.vue";

import { staff, projects as initialProjects } from "@/data.js";

import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/api/taskService.js";

const router = useRouter();
const { isAuthenticated, getAccessTokenSilently } = useAuth0();

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const tasks = ref([]);
const projects = ref(initialProjects || []);
const loadingError = ref(null);

const showCreate = ref(false);
const showEdit = ref(false);
const showCreateProject = ref(false);
// NEU: State für Rechnungs-Modal
const showInvoice = ref(false);
const invoiceData = ref({ total: 0, items: [] });

const selectedTaskId = ref(null);
const isAdmin = ref(false);

const createForm = ref(null);
const createProjectForm = ref(null);
const editForm = ref(null);
let createFormBuffer = null;
let createProjectFormBuffer = null;

async function loadTasks() {
  loadingError.value = null;
  try {
    const token = await getAccessTokenSilently();
    tasks.value = await getAllTasks(token);
  } catch (e) {
    console.error(e);
    loadingError.value = "Fehler beim Laden der Aufgaben.";
  }
}

async function checkAdminRole() {
  try {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_BASE}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      isAdmin.value = false;
      return;
    }

    const data = await res.json();
    isAdmin.value = data.role === "ADMIN";
  } catch (e) {
    console.error("Error checking admin role:", e);
    isAdmin.value = false;
  }
}

onMounted(async () => {
  await loadTasks();
  if (isAuthenticated.value) await checkAdminRole();
});

watch(isAuthenticated, async (v) => {
  if (v) await checkAdminRole();
  else isAdmin.value = false;
});

const filteredTasks = computed(() => {
  const grouped = { Erledigt: [], "In Bearbeitung": [], Review: [] };
  for (const t of tasks.value) {
    if (grouped[t.status]) grouped[t.status].push(t);
  }
  return grouped;
});

// NEU: Funktion zur Rechnungsberechnung
function calculateInvoice() {
  const doneTasks = filteredTasks.value["Erledigt"] || [];
  let total = 0;
  const items = [];

  doneTasks.forEach(task => {
    // Parsing der Dauer sicherstellen (falls String)
    const duration = parseFloat(task.duration) || 0;
    const cost = duration * 100;
    total += cost;
    items.push({
      id: task.id,
      title: task.title,
      duration: duration,
      cost: cost
    });
  });

  invoiceData.value = {
    total: total,
    items: items
  };
  
  showInvoice.value = true;
}

function openCreateTask() {
  if (!isAdmin.value) return;
  showCreate.value = true;
}

function openEditTask(id) {
  if (!isAdmin.value) {
    router.push({ name: "task-detail", params: { id } });
    return;
  }
  selectedTaskId.value = id;
  showEdit.value = true;
}

function openCreateProject() {
  createProjectFormBuffer = null;
  showCreateProject.value = true;
}

function onProjectFormInput(body) {
  createProjectFormBuffer = body;
}

function submitCreateProject() {
  createProjectForm.value?.submitForm();

  if (!createProjectFormBuffer || !createProjectFormBuffer.title) {
    alert("Bitte mindestens einen Titel für das Projekt eingeben.");
    return;
  }
  
  projects.value.push({ 
    name: createProjectFormBuffer.title, 
    active: false 
  });
  
  showCreateProject.value = false;
  createProjectFormBuffer = null;
}

function onCreateFormInput(body) {
  createFormBuffer = body;
}

async function submitCreateTask() {
  if (!isAdmin.value) return;

  createForm.value?.submitForm();

  if (!createFormBuffer) {
    alert("Bitte Formular ausfüllen!");
    return;
  }

  try {
    const token = await getAccessTokenSilently();
    await createTask(token, createFormBuffer);

    showCreate.value = false;
    createFormBuffer = null;
    await loadTasks();
  } catch (e) {
    console.error(e);
    alert("Erstellen fehlgeschlagen.");
  }
}

async function saveTask(body) {
  if (!isAdmin.value) return;

  try {
    const token = await getAccessTokenSilently();
    await updateTask(token, selectedTaskId.value, body);

    showEdit.value = false;
    await loadTasks();
  } catch (e) {
    console.error(e);
    alert("Speichern fehlgeschlagen.");
  }
}

async function deleteTaskById() {
  if (!isAdmin.value) return;

  try {
    const token = await getAccessTokenSilently();
    await deleteTask(token, selectedTaskId.value);

    showEdit.value = false;
    await loadTasks();
  } catch (e) {
    console.error(e);
    alert("Löschen fehlgeschlagen.");
  }
}
</script>

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

.sidebar {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 0 40px rgba(0,0,0,0.1);
  margin-left: -15px;
  min-height: 100%;
}

.dashboard-header-container {
  padding: 0 0 1rem 0;
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

.kanban-header {
  font-size: 1.2rem;
  font-weight: 600;
  color: #495057;
}

.project-list li.active a {
  font-weight: bold;
  color: var(--bs-primary);
  border-bottom: 2px solid var(--bs-primary);
}
</style>