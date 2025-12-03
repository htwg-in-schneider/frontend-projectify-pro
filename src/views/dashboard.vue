<template>
  <div class="dashboard-page container">
    
    <div class="row">

      <main class="col-lg-9 kanban-area-wrapper p-0"> 
        <div class="dashboard-wrapper p-4 p-md-5"> 
          
          <div class="kanban-area">

            <!-- HEADER -->
            <div class="d-flex justify-content-between align-items-center mb-4 dashboard-header-container">
              <h2 class="fw-bold mb-0 dashboard-title">Projekt Dashboard</h2> 
              
              <div class="d-flex flex-wrap align-items-center">
                <Button variant="primary" class="me-2 mb-2 mb-sm-0 btn-custom-blue">Projekt erstellen</Button>
                
                <!-- Neue Aufgabe Button -->
                <Button 
                  variant="primary" 
                  class="me-2 mb-2 mb-sm-0 btn-custom-blue"
                  @click="openCreateTask"
                >
                  Neue Aufgabe
                </Button>

                <Button variant="success" class="mb-2 mb-sm-0 btn-custom-green">Rechnung erstellen</Button>
              </div>
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
              :class="{ active: project.active }">
              <a href="#" class="text-decoration-none">{{ project.name }}</a>
            </li>
          </ul>
        </div>

      </aside>
    </div>

    <!-- POPUP: Neue Aufgabe -->
    <TaskModal 
      :show="showCreate" 
      title="Neue Aufgabe" 
      @close="showCreate = false"
    >
      <CreateTaskForm @submit="createDummyTask" />

      <template #footer>
        <button class="btn btn-secondary" @click="showCreate = false">Abbrechen</button>
        <button class="btn btn-success" @click="createDummyTask">Erstellen</button>
      </template>
    </TaskModal>


    <!-- POPUP: Aufgabe bearbeiten -->
    <TaskModal 
      :show="showEdit" 
      title="Aufgabe bearbeiten" 
      @close="showEdit = false"
    >
      <EditTaskForm 
        :taskId="selectedTaskId" 
        :backend="false"
        @save="saveDummyTask" 
        @delete="deleteDummyTask" 
      />

      <template #footer>
        <button class="btn btn-danger" @click="deleteDummyTask">Löschen</button>
        <button class="btn btn-success" @click="saveDummyTask">Speichern</button>
      </template>
    </TaskModal>

  </div>
</template>



<script setup>
/* IMPORTS */
import { ref, computed } from 'vue';
import { tasks, staff, projects } from '@/data.js'; 

import TaskCard from '@/components/taskCard.vue'; 
import Button from '@/components/button.vue'; 
import TaskModal from '@/components/TaskModal.vue';
import CreateTaskForm from '@/components/CreateTaskForm.vue';
import EditTaskForm from '@/components/EditTaskForm.vue';


/* MODAL STATES */
const showCreate = ref(false);
const showEdit = ref(false);
const selectedTaskId = ref(null);


/* LOCAL STORAGE DUMMY TASKS */
localStorage.setItem('dummyTasks', JSON.stringify(tasks));
const dummyTasks = ref(JSON.parse(localStorage.getItem('dummyTasks')));

/* OPEN MODALS */
function openCreateTask() {
  showCreate.value = true;
}

function openEditTask(id) {
  selectedTaskId.value = id;
  showEdit.value = true;
}


/* CRUD: DUMMY MODE ONLY */
function createDummyTask(body) {
  const list = JSON.parse(localStorage.getItem('dummyTasks'));
  list.push({ id: Date.now(), ...body });

  localStorage.setItem('dummyTasks', JSON.stringify(list));
  dummyTasks.value = list;

  alert('Aufgabe erstellt!');
  showCreate.value = false;
}

function saveDummyTask(body) {
  let list = JSON.parse(localStorage.getItem('dummyTasks'));
  const index = list.findIndex(t => t.id === selectedTaskId.value);

  list[index] = { id: selectedTaskId.value, ...body };

  localStorage.setItem('dummyTasks', JSON.stringify(list));
  dummyTasks.value = list;

  alert('Änderungen gespeichert!');
  showEdit.value = false;
}

function deleteDummyTask() {
  let list = JSON.parse(localStorage.getItem('dummyTasks'));
  list = list.filter(t => t.id !== selectedTaskId.value);

  localStorage.setItem('dummyTasks', JSON.stringify(list));
  dummyTasks.value = list;

  alert('Aufgabe gelöscht!');
  showEdit.value = false;
}


/* GROUP TASKS BY STATUS */
const filteredTasks = computed(() => {
  const grouped = {
    'Erledigt': [],
    'In Bearbeitung': [],
    'Review': []
  };

  dummyTasks.value.forEach(task => {
    if (grouped[task.status]) grouped[task.status].push(task);
  });

  return grouped;
});
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
