<script setup>
//import Footer from '@/components/footer.vue';
//import Navbar from '@/components/navbar.vue';
import SpecialBanner from '@/components/specialBanner.vue';
import NavButton from '@/components/navButton.vue';
import Button from '@/components/button.vue';
import { ref, onMounted } from 'vue';

const url = 'http://localhost:8081/api/task';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
});

const task = ref(null);

onMounted(() => {
  fetchTask();
});

async function fetchTask() {
  try {
    const response = await fetch(`${url}/${props.id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    task.value = await response.json();
    console.log(task.value);
  } catch (error) {
    console.error('Error fetching task:', error);
  }
}
</script>

<template>
  <SpecialBanner text='Aufgabendetails' />
  <Navbar />

  <section class="container py-5">
    <div v-if="task" class="row">

      <!-- Bildplatzhalter -->
      <div class="col-md-6">
        <img 
          src="https://via.placeholder.com/600x400?text=Task" 
          class="img-fluid rounded shadow-sm"
          alt="Task Bild"
        />
      </div>

      <!-- Task-Informationen -->
      <div class="col-md-6">
        <h2 class="fw-bold mb-3">{{ task.title }}</h2>

        <p class="fst-italic text-secondary">
          Status: <strong>{{ task.status }}</strong>
        </p>

        <p>
          <strong>Bearbeiter:</strong> {{ task.assignedTo }}
        </p>

        <p class="mt-3">{{ task.description }}</p>

        <NavButton variant="secondary" class="me-2" to="/catalog">Zurück</NavButton>
        <Button variant="accent">Bearbeiten</Button>
      </div>
    </div>

    <!-- Fallback, falls Task nicht existiert -->
    <div v-else class="text-center">
      <p>Aufgabe wurde nicht gefunden.</p>
      <NavButton variant="secondary" to="/catalog">Zurück</NavButton>
    </div>
  </section>

  <Footer />
</template>

<style scoped></style>
