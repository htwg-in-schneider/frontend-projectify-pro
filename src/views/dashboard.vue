<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";

import TaskCard from "@/components/taskCard.vue";
import Button from "@/components/button.vue";
import TaskModal from "@/components/TaskModal.vue";
import CreateTaskForm from "@/components/CreateTaskForm.vue";
import EditTaskForm from "@/components/EditTaskForm.vue";

// API Services
import { getAllTasks, createTask, updateTask, deleteTask } from "@/api/taskService.js";
import { getAllProjects, createProject, updateProject, deleteProject } from "@/api/projectService.js";
import { getAllUsers } from "@/api/userService.js"; 

const router = useRouter();
const { isAuthenticated, getAccessTokenSilently } = useAuth0();
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// STATE
const tasks = ref([]);
const projects = ref([]); 
const staff = ref([]);
const selectedProject = ref(null);

// 
const searchQuery = ref('');

const loadingError = ref(null);
const isAdmin = ref(false);

const showCreate = ref(false);
const showEdit = ref(false);
const showCreateProject = ref(false);
const showEditProject = ref(false); 
const showInvoice = ref(false);

const invoiceData = ref({ total: 0, items: [] });
const selectedTaskId = ref(null);
const editProjectData = ref({ id: null, name: '', status: '', startDate: '', endDate: '', duration: '' });

const createForm = ref(null);
const createProjectForm = ref(null);
const editForm = ref(null);
let createFormBuffer = null;
let createProjectFormBuffer = null;

onMounted(async () => {
  await loadProjects(); 
  if (isAuthenticated.value) {
    await checkAdminRole();
    await loadStaff();
  }
});

watch(isAuthenticated, async (v) => {
  if (v) {
    await checkAdminRole();
    await loadStaff();
  }
});

// --- API ACTIONS ---

async function loadStaff() {
  try {
    const token = await getAccessTokenSilently();
    const users = await getAllUsers(token);
    staff.value = users.map(u => u.username || u.name || u.email);
  } catch (e) {
    console.error("Fehler beim Laden der Mitarbeiter:", e);
  }
}

async function loadProjects() {
  loadingError.value = null;
  try {
    const token = await getAccessTokenSilently();
    const backendProjects = await getAllProjects(token);
    projects.value = backendProjects || [];
  } catch (e) {
    console.error("Fehler beim Laden der Projekte:", e);
    loadingError.value = "Konnte keine Verbindung zum Server herstellen.";
    projects.value = [];
  }
}

async function selectProject(project) {
  selectedProject.value = project;
  searchQuery.value = ''; // Suche beim Projektwechsel zurücksetzen
  if (project.id) {
    await loadTasksForProject(project.id);
  }
}

function closeProject() {
  selectedProject.value = null;
  searchQuery.value = '';
  tasks.value = [];
}

async function loadTasksForProject(projectId) {
  loadingError.value = null;
  try {
    const token = await getAccessTokenSilently();
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

// --- COMPUTED (GEFILTERT DURCH SUCHE) ---


const filteredProjects = computed(() => {
  const grouped = { Erledigt: [], "In Bearbeitung": [], Offen: [] };
  
  const searchMatch = projects.value.filter(p => 
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  for (const p of searchMatch) {
    let status = p.status || "In Bearbeitung";
    if (status === 'Review') status = 'Offen';
    if (grouped[status]) grouped[status].push(p);
    else grouped["In Bearbeitung"].push(p);
  }
  return grouped;
});


const filteredTasks = computed(() => {
  const grouped = { Erledigt: [], "In Bearbeitung": [], Offen: [] };
  
  const searchMatch = tasks.value.filter(t => 
    t.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  for (const t of searchMatch) {
    let status = t.status;
    if (status === 'Review') status = 'Offen'; 
    if (grouped[status]) grouped[status].push(t);
  }
  return grouped;
});

// --- ACTIONS ---

function openEditProject(project) {
  editProjectData.value = { ...project };
  showEditProject.value = true;
}

async function submitEditProject() {
  if (!editProjectData.value.name) return alert("Name fehlt");
  try {
    const token = await getAccessTokenSilently();
    await updateProject(token, editProjectData.value.id, editProjectData.value);
    showEditProject.value = false;
    await loadProjects();
    if (selectedProject.value && selectedProject.value.id === editProjectData.value.id) {
       selectedProject.value = { ...editProjectData.value };
    }
  } catch(e) {
    alert("Speichern fehlgeschlagen: " + e.message);
  }
}

async function deleteProjectById() {
  if (!confirm("Möchten Sie dieses Projekt wirklich löschen? Alle Aufgaben darin werden ebenfalls gelöscht.")) return;
  try {
    const token = await getAccessTokenSilently();
    await deleteProject(token, editProjectData.value.id);
    showEditProject.value = false;
    if (selectedProject.value && selectedProject.value.id === editProjectData.value.id) {
       closeProject();
    }
    await loadProjects();
  } catch(e) {
    alert("Löschen fehlgeschlagen: " + e.message);
  }
}

function getProjectName(id) {
  const p = projects.value.find(proj => proj.id === id);
  return p ? p.name : '';
}

async function calculateInvoice() {
  let tasksToProcess = [];
  if (!selectedProject.value) {
    try {
      const token = await getAccessTokenSilently();
      const allTasks = await getAllTasks(token);
      tasksToProcess = allTasks.filter(t => t.status === 'Erledigt');
    } catch (e) {
      alert("Fehler beim Laden der Aufgaben für die Gesamtrechnung.");
      return;
    }
  } else {
    tasksToProcess = filteredTasks.value["Erledigt"] || [];
  }

  let total = 0;
  const items = [];
  tasksToProcess.forEach(task => {
    const duration = parseFloat(task.duration) || 0;
    const cost = duration * 100;
    total += cost;
    items.push({ 
      id: task.id, 
      title: task.title, 
      duration, 
      cost,
      projectName: !selectedProject.value ? getProjectName(task.projectId) : null 
    });
  });
  invoiceData.value = { total, items };
  showInvoice.value = true;
}

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
    await createProject(token, { 
      name: createProjectFormBuffer.title, 
      status: createProjectFormBuffer.status || "In Bearbeitung",
      startDate: createProjectFormBuffer.startDate || "",
      endDate: createProjectFormBuffer.endDate || "",
      duration: createProjectFormBuffer.duration || ""
    });
    await loadProjects();
    showCreateProject.value = false;
  } catch (e) { alert("Fehler Projekt erstellen"); }
}

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
    const payload = { ...createFormBuffer, projectId: selectedProject.value.id };
    await createTask(token, payload);
    showCreate.value = false;
    await loadTasksForProject(selectedProject.value.id);
  } catch (e) { alert("Fehler Task erstellen"); }
}

function openEditTask(id) {
  if (!isAdmin.value) return; 
  selectedTaskId.value = id;
  showEdit.value = true;
}

async function saveTask(body) {
  try {
    const token = await getAccessTokenSilently();
    const payload = { 
      ...body, 
      projectId: selectedProject.value.id,
      assignedTo: body.assignedUser || body.assignedTo 
    };
    
    await updateTask(token, selectedTaskId.value, payload);
    showEdit.value = false;
    await loadTasksForProject(selectedProject.value.id);
  } catch (e) { 
    alert("Speichern fehlgeschlagen"); 
  }
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

<template>
  <div class="dashboard-page container">
    <div class="row">

      <main class="col-lg-9 kanban-area-wrapper p-0">
        <div class="dashboard-wrapper p-4 p-md-5">
          <div class="kanban-area">

            <div class="d-flex flex-column mb-4 dashboard-header-container">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <button v-if="selectedProject" class="btn btn-sm btn-outline-secondary mb-2" @click="closeProject">
                    &larr; Zurück zur Übersicht
                  </button>
                  <h2 v-if="!selectedProject" class="fw-bold mb-0 dashboard-title">Projekt Übersicht</h2>
                  <h2 v-else class="fw-bold mb-0 dashboard-title">{{ selectedProject.name }}</h2>
                </div>

                <div class="d-flex flex-wrap align-items-center">
                  <Button v-if="!selectedProject" variant="primary" class="me-2 btn-custom-blue" @click="openCreateProject">
                    Neues Projekt
                  </Button>
                  <Button v-if="selectedProject && isAdmin" variant="secondary" class="me-2" @click="openEditProject(selectedProject)">
                    Projekt bearbeiten
                  </Button>
                  <Button v-if="selectedProject && isAdmin" variant="primary" class="me-2 btn-custom-blue" @click="openCreateTask">
                    Aufgabe erstellen
                  </Button>
                  <Button variant="success" class="btn-custom-green" @click="calculateInvoice">
                    Rechnung erstellen
                  </Button>
                </div>
              </div>

              <div class="search-container">
                <div class="input-group shadow-sm">
                  <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
                  <input 
                    type="text" 
                    v-model="searchQuery" 
                    class="form-control border-start-0 ps-0" 
                    :placeholder="selectedProject ? 'Aufgaben in diesem Projekt suchen...' : 'Projekte suchen...'"
                  />
                </div>
              </div>
            </div>

            <div v-if="loadingError" class="alert alert-danger py-2">{{ loadingError }}</div>
            
            <div v-if="projects.length === 0 && !loadingError && !selectedProject" class="alert alert-info py-4 text-center">
              <h4>Keine Projekte vorhanden</h4>
              <p>Aktuell sind keine Projekte im System gespeichert.</p>
              <p v-if="isAdmin">Klicken Sie auf "Neues Projekt", um zu beginnen.</p>
            </div>

            <div v-if="!selectedProject && projects.length > 0" class="row g-4 kanban-container">
               <div class="col-md-4" v-for="status in ['Erledigt', 'In Bearbeitung', 'Offen']" :key="status">
                <h4 class="mb-3 kanban-header">{{ status }}</h4>
                <div class="kanban-column">
                  <div v-for="proj in filteredProjects?.[status]" :key="proj.id" class="card mb-3 project-card border-0 shadow-sm position-relative" @click="selectProject(proj)">
                    <div v-if="isAdmin" class="position-absolute top-0 end-0 p-2" style="z-index: 10;">
                      <button class="btn btn-sm btn-light border rounded-circle" @click.stop="openEditProject(proj)">✏️</button>
                    </div>
                    <div class="card-body border-start border-4" :class="{'border-success': status === 'Erledigt', 'border-primary': status === 'In Bearbeitung', 'border-warning': status === 'Offen'}">
                      <h6 class="card-title fw-bold mb-2">{{ proj.name }}</h6>
                      <div class="small text-muted mb-1" v-if="proj.startDate || proj.endDate">
                        <i class="bi bi-calendar-event me-1"></i> {{ proj.startDate || '?' }} - {{ proj.endDate || '?' }}
                      </div>
                      <div class="small text-muted" v-if="proj.duration"><i class="bi bi-clock me-1"></i> {{ proj.duration }} Std.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="selectedProject" class="row g-4 kanban-container">
              <div class="col-md-4" v-for="status in ['Erledigt', 'In Bearbeitung', 'Offen']" :key="status">
                <h4 class="mb-3 kanban-header">{{ status }}</h4>
                <div class="kanban-column">
                  <TaskCard v-for="task in filteredTasks?.[status]" :key="task.id" :task="task" @click="openEditTask(task.id)" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <aside class="col-lg-3 sidebar p-4">
        <div class="sidebar-block mb-5">
          <h4 class="d-flex justify-content-between align-items-center sidebar-header">Mitarbeiter</h4>
          <ul class="list-unstyled staff-list" v-if="staff.length > 0">
            <li v-for="name in staff" :key="name">👤 {{ name }}</li>
          </ul>
          <p v-else class="text-muted small">Keine Mitarbeiter gefunden.</p>
        </div>
        
        <div class="sidebar-block">
          <div v-if="selectedProject">
            <h6 class="text-primary fw-bold">Aktuelles Projekt:</h6>
            <p class="fs-5 fw-bold mb-1">{{ selectedProject.name }}</p>
            <p class="small text-muted">Status: {{ selectedProject.status }}</p>
          </div>
          <div v-else>
             <p class="text-muted small">Wählen Sie ein Projekt aus der Übersicht, um die Aufgaben zu sehen.</p>
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

    <TaskModal :show="showEditProject" title="Projekt bearbeiten" @close="showEditProject = false">
      <div v-if="editProjectData">
        <div class="mb-3">
          <label class="form-label">Projekt Name</label>
          <input v-model="editProjectData.name" type="text" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">Status</label>
          <select v-model="editProjectData.status" class="form-select">
            <option>Offen</option>
            <option>In Bearbeitung</option>
            <option>Erledigt</option>
          </select>
        </div>
        <div class="row">
          <div class="col-6 mb-3">
             <label class="form-label">Startdatum</label>
             <input v-model="editProjectData.startDate" type="date" class="form-control" />
          </div>
          <div class="col-6 mb-3">
             <label class="form-label">Enddatum</label>
             <input v-model="editProjectData.endDate" type="date" class="form-control" />
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Geplante Dauer (Std.)</label>
          <input v-model="editProjectData.duration" type="number" class="form-control" />
        </div>
      </div>
      <template #footer>
        <button class="btn btn-danger" @click="deleteProjectById">Löschen</button>
        <button class="btn btn-success" @click="submitEditProject">Speichern</button>
      </template>
    </TaskModal>

    <TaskModal :show="showInvoice" title="Rechnung" @close="showInvoice = false">
      <div v-if="invoiceData.items.length > 0">
        <p class="text-muted mb-3">für alle erledigten Aufgaben (Stundensatz: 100€)</p>
        <ul class="list-group mb-4">
          <li v-for="item in invoiceData.items" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div class="fw-bold">{{ item.title }}</div>
              <small v-if="item.projectName" class="text-muted d-block">Projekt: {{ item.projectName }}</small>
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
      <div v-else class="alert alert-info">Keine erledigten Aufgaben für die Rechnungsstellung gefunden.</div>
      <template #footer>
        <button class="btn btn-secondary" @click="showInvoice = false">Schließen</button>
      </template>
    </TaskModal>

  </div>
</template>

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

.search-container { max-width: 100%; }
.search-container input:focus { border-color: #0d6efd; box-shadow: none; }

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