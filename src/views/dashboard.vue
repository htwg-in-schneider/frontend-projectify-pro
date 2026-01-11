<template>
  <div class="dashboard-page container">
    <div class="row">

      <main class="col-lg-9 kanban-area-wrapper p-0">
        <div class="dashboard-wrapper p-4 p-md-5">
          <div class="kanban-area">

            <div class="d-flex justify-content-between align-items-center mb-4 dashboard-header-container">
              <div>
                <button v-if="selectedProject" class="btn btn-sm btn-outline-secondary mb-2" @click="closeProject">
                  &larr; Zurück zur Übersicht
                </button>
              </div>

              <div class="d-flex flex-wrap align-items-center">
                <Button 
                  v-if="!selectedProject"
                  variant="primary" 
                  class="me-2 btn-custom-blue"
                  @click="openCreateProject"
                >
                  Neues Projekt
                </Button>

                <Button
                  v-if="selectedProject && isAdmin"
                  variant="primary"
                  class="me-2 btn-custom-blue"
                  @click="openCreateTask"
                >
                  Aufgabe erstellen
                </Button>

                <Button 
                  v-if="selectedProject"
                  variant="success" 
                  class="btn-custom-green"
                  @click="calculateInvoice"
                >
                  Rechnung
                </Button>
              </div>
            </div>

            <div v-if="loadingError" class="alert alert-danger">
              {{ loadingError }}
            </div>

            <div v-if="!selectedProject" class="row g-4 kanban-container">
              
               <div class="col-md-4">
                <h4 class="mb-3 kanban-header">Erledigt</h4>
                <div class="kanban-column">
                  <div 
                    v-for="proj in filteredProjects?.Erledigt" 
                    :key="proj.id" 
                    class="card mb-3 project-card border-0 shadow-sm"
                    @click="selectProject(proj)"
                  >
                    <div class="card-body border-start border-4 border-success">
                      <h6 class="card-title fw-bold mb-1">{{ proj.name }}</h6>
                      <div class="text-muted small">
                        <span v-if="proj.startDate">{{ proj.startDate }}</span>
                        <span v-if="proj.endDate"> - {{ proj.endDate }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <h4 class="mb-3 kanban-header">In Bearbeitung</h4>
                <div class="kanban-column">
                  <div 
                    v-for="proj in filteredProjects?.['In Bearbeitung']" 
                    :key="proj.id" 
                    class="card mb-3 project-card border-0 shadow-sm"
                    @click="selectProject(proj)"
                  >
                    <div class="card-body border-start border-4 border-primary">
                      <h6 class="card-title fw-bold mb-1">{{ proj.name }}</h6>
                      <div class="text-muted small">
                        <span v-if="proj.startDate">Start: {{ proj.startDate }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <h4 class="mb-3 kanban-header">Offen</h4>
                <div class="kanban-column">
                  <div 
                    v-for="proj in filteredProjects?.Offen" 
                    :key="proj.id" 
                    class="card mb-3 project-card border-0 shadow-sm"
                    @click="selectProject(proj)"
                  >
                    <div class="card-body border-start border-4 border-warning">
                      <h6 class="card-title fw-bold mb-1">{{ proj.name }}</h6>
                      <small class="text-muted">Offen</small>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div v-else class="row g-4 kanban-container">

              <div class="col-md-4">
                <h4 class="mb-3 kanban-header">Erledigt</h4>
                <div class="kanban-column">
                  <TaskCard v-for="task in filteredTasks?.Erledigt" :key="task.id" :task="task" @click="openEditTask(task.id)" />
                </div>
              </div>

              <div class="col-md-4">
                <h4 class="mb-3 kanban-header">In Bearbeitung</h4>
                <div class="kanban-column">
                  <TaskCard v-for="task in filteredTasks?.['In Bearbeitung']" :key="task.id" :task="task" @click="openEditTask(task.id)" />
                </div>
              </div>

              <div class="col-md-4">
                <h4 class="mb-3 kanban-header">Offen</h4>
                <div class="kanban-column">
                  <TaskCard v-for="task in filteredTasks?.Offen" :key="task.id" :task="task" @click="openEditTask(task.id)" />
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <aside class="col-lg-3 sidebar p-4">
        <div class="sidebar-block mb-5">
          <h4 class="d-flex justify-content-between align-items-center sidebar-header">
            Mitarbeiter
          </h4>
          <ul class="list-unstyled staff-list">
            <li v-for="name in staff || []" :key="name">{{ name }}</li>
          </ul>
        </div>
        
        <div class="sidebar-block">
          <div v-if="selectedProject">
            <h6 class="text-primary fw-bold">Aktuelles Projekt:</h6>
            <p>{{ selectedProject.name }}</p>
          </div>
          <div v-else>
             <p class="text-muted small">
              Wählen Sie ein Projekt aus der Übersicht, um die Aufgaben zu sehen.
            </p>
          </div>
        </div>
      </aside>

    </div>

    <TaskModal :show="showCreate" title="Neue Aufgabe" @close="showCreate = false">
      <CreateTaskForm ref="createForm" @submit="onCreateFormInput" />
      <template #footer>
        <button class="btn btn-secondary" @click="showCreate = false">Abbrechen</button>
        <button class="btn btn-success" @click="submitCreateTask">Erstellen</button>
      </template>
    </TaskModal>

    <TaskModal :show="showEdit" title="Aufgabe bearbeiten" @close="showEdit = false">
      <EditTaskForm ref="editForm" :taskId="selectedTaskId" :backend="true" @save="saveTask" @delete="deleteTaskById" />
      <template #footer>
        <button class="btn btn-danger" @click="deleteTaskById">Löschen</button>
        <button class="btn btn-success" @click="editForm?.save()">Speichern</button>
      </template>
    </TaskModal>

    <TaskModal :show="showCreateProject" title="Neues Projekt" @close="showCreateProject = false">
      <CreateTaskForm ref="createProjectForm" @submit="onProjectFormInput" />
      <template #footer>
        <button class="btn btn-secondary" @click="showCreateProject = false">Abbrechen</button>
        <button class="btn btn-success" @click="submitCreateProject">Erstellen</button>
      </template>
    </TaskModal>

    <TaskModal :show="showInvoice" title="Rechnung" @close="showInvoice = false">
      <div v-if="invoiceData.items.length > 0">
        <ul class="list-group mb-4">
          <li v-for="item in invoiceData.items" :key="item.id" class="list-group-item d-flex justify-content-between">
            <div><strong>{{ item.title }}</strong> <br><small>{{ item.duration }} Std.</small></div>
            <span>{{ item.cost }} €</span>
          </li>
        </ul>
        <h3 class="text-end text-success fw-bold">{{ invoiceData.total }} €</h3>
      </div>
      <div v-else class="alert alert-info">Keine Daten.</div>
      <template #footer>
        <button class="btn btn-secondary" @click="showInvoice = false">Schließen</button>
      </template>
    </TaskModal>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";

// Components
import TaskCard from "@/components/taskCard.vue";
import Button from "@/components/button.vue";
import TaskModal from "@/components/TaskModal.vue";
import CreateTaskForm from "@/components/CreateTaskForm.vue";
import EditTaskForm from "@/components/EditTaskForm.vue";

// Data & API
import { staff } from "@/data.js";
import { getAllTasks, createTask, updateTask, deleteTask } from "@/api/taskService.js";
import { getAllProjects, createProject } from "@/api/projectService.js";

const router = useRouter();
const { isAuthenticated, getAccessTokenSilently } = useAuth0();
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// STATE
const tasks = ref([]);
const projects = ref([]);
const selectedProject = ref(null); // NULL = Projektübersicht, OBJEKT = Task Board

const loadingError = ref(null);
const isAdmin = ref(false);

// Modals State
const showCreate = ref(false);
const showEdit = ref(false);
const showCreateProject = ref(false);
const showInvoice = ref(false);
const invoiceData = ref({ total: 0, items: [] });
const selectedTaskId = ref(null);

// Forms
const createForm = ref(null);
const createProjectForm = ref(null);
const editForm = ref(null);
let createFormBuffer = null;
let createProjectFormBuffer = null;

// --- INITIAL LOAD ---
onMounted(async () => {
  await loadProjects(); // Zuerst nur Projekte laden
  if (isAuthenticated.value) await checkAdminRole();
});

watch(isAuthenticated, async (v) => {
  if (v) await checkAdminRole();
});

// --- API ACTIONS ---

async function loadProjects() {
  try {
    const token = await getAccessTokenSilently();
    projects.value = await getAllProjects(token);
  } catch (e) {
    console.error("Fehler Projekte:", e);
    loadingError.value = "Konnte Projekte nicht laden.";
  }
}

async function selectProject(project) {
  selectedProject.value = project;
  await loadTasksForProject(project.id);
}

function closeProject() {
  selectedProject.value = null;
  tasks.value = [];
}

async function loadTasksForProject(projectId) {
  loadingError.value = null;
  try {
    const token = await getAccessTokenSilently();
    // Ruft Tasks gefiltert nach Projekt ID ab
    tasks.value = await getAllTasks(token, projectId);
  } catch (e) {
    console.error(e);
    loadingError.value = "Fehler beim Laden der Aufgaben.";
  }
}

async function checkAdminRole() {
  try {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_BASE}/api/profile`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      isAdmin.value = data.role === "ADMIN";
    }
  } catch(e) { isAdmin.value = false; }
}

// --- COMPUTED ---

// Projekte filtern nach Status
const filteredProjects = computed(() => {
  const grouped = { Erledigt: [], "In Bearbeitung": [], Offen: [] };
  
  for (const p of projects.value) {
    // Fallback falls Status im Backend null ist
    const status = p.status || "In Bearbeitung"; 
    
    if (grouped[status]) {
      grouped[status].push(p);
    } else {
      // Unbekannte Status in "In Bearbeitung" sammeln
      grouped["In Bearbeitung"].push(p);
    }
  }
  return grouped;
});

// Tasks filtern nach Status
const filteredTasks = computed(() => {
  const grouped = { Erledigt: [], "In Bearbeitung": [], Offen: [] };
  for (const t of tasks.value) {
    if (grouped[t.status]) grouped[t.status].push(t);
  }
  return grouped;
});

// --- ACTIONS ---

function calculateInvoice() {
  const doneTasks = filteredTasks.value["Erledigt"] || [];
  let total = 0;
  const items = [];
  doneTasks.forEach(task => {
    const duration = parseFloat(task.duration) || 0;
    const cost = duration * 100;
    total += cost;
    items.push({ id: task.id, title: task.title, duration, cost });
  });
  invoiceData.value = { total, items };
  showInvoice.value = true;
}

// CREATE PROJECT
function openCreateProject() {
  createProjectFormBuffer = null;
  showCreateProject.value = true;
}
function onProjectFormInput(body) { createProjectFormBuffer = body; }

async function submitCreateProject() {
  createProjectForm.value?.submitForm();
  if (!createProjectFormBuffer?.title) return alert("Titel fehlt");

  try {
    const token = await getAccessTokenSilently();
    // Hier können später auch startDate/endDate aus dem Formular kommen
    await createProject(token, { 
      name: createProjectFormBuffer.title, 
      status: "In Bearbeitung", // Standard-Status für neue Projekte
      startDate: createProjectFormBuffer.startDate || "",
      endDate: createProjectFormBuffer.endDate || "",
      duration: createProjectFormBuffer.duration || ""
    });
    await loadProjects();
    showCreateProject.value = false;
  } catch (e) { alert("Fehler Projekt erstellen"); }
}

// CREATE TASK
function openCreateTask() {
  if (!isAdmin.value) return;
  showCreate.value = true;
}
function onCreateFormInput(body) { createFormBuffer = body; }

async function submitCreateTask() {
  if (!isAdmin.value) return;
  createForm.value?.submitForm();
  if (!createFormBuffer) return alert("Formular leer");

  try {
    const token = await getAccessTokenSilently();
    // WICHTIG: Projekt ID hinzufügen
    const payload = { ...createFormBuffer, projectId: selectedProject.value.id };
    
    await createTask(token, payload);
    showCreate.value = false;
    await loadTasksForProject(selectedProject.value.id);
  } catch (e) { alert("Fehler Task erstellen"); }
}

// EDIT / DELETE TASK
function openEditTask(id) {
  if (!isAdmin.value) return; 
  selectedTaskId.value = id;
  showEdit.value = true;
}

async function saveTask(body) {
  try {
    const token = await getAccessTokenSilently();
    const payload = { ...body, projectId: selectedProject.value.id };
    await updateTask(token, selectedTaskId.value, payload);
    showEdit.value = false;
    await loadTasksForProject(selectedProject.value.id);
  } catch (e) { alert("Speichern fehlgeschlagen"); }
}

async function deleteTaskById() {
  try {
    const token = await getAccessTokenSilently();
    await deleteTask(token, selectedTaskId.value);
    showEdit.value = false;
    await loadTasksForProject(selectedProject.value.id);
  } catch (e) { alert("Löschen fehlgeschlagen"); }
}
</script>

<style scoped>
.dashboard-page.container { padding-top: 2rem; padding-bottom: 2rem; }
.dashboard-wrapper {
  font-family: 'Montserrat', sans-serif;
  background: rgba(255, 255, 255, 0.53);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 0 40px rgba(0,0,0,0.1);
  min-height: 70vh;
}
.kanban-area-wrapper { padding-right: 0 !important; }
.kanban-area { background: none; padding-right: 2rem !important; }
.sidebar {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 0 40px rgba(0,0,0,0.1);
  margin-left: -15px;
  min-height: 100%;
}
.dashboard-title { color: #0d6efd !important; font-weight: 700; }
.btn-custom-blue { background-color: #007BFF !important; color: white !important; }
.btn-custom-green { background-color: #19C059 !important; color: white !important; }

/* Styles für Projekt-Karten */
.project-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background: rgba(255,255,255,0.9);
}
.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1) !important;
}
.kanban-header {
  font-size: 1.1rem;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>