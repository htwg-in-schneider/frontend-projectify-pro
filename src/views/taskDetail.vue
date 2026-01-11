<script setup>
import SpecialBanner from "@/components/specialBanner.vue";
import NavButton from "@/components/navButton.vue";
import Button from "@/components/button.vue";
import Navbar from "@/components/navbar.vue";
import Footer from "@/components/footer.vue";

import { ref, onMounted } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});

const task = ref(null);
const loading = ref(false);
const error = ref(null);

const { getAccessTokenSilently } = useAuth0();
const API_BASE = import.meta.env.VITE_API_BASE_URL;

onMounted(() => {
  fetchTask();
});

async function fetchTask() {
  loading.value = true;
  error.value = null;

  try {
    const token = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE}/api/task/${props.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    task.value = await response.json();
  } catch (e) {
    console.error("Error fetching task:", e);
    error.value = "Aufgabe konnte nicht geladen werden.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <SpecialBanner text="Aufgabendetails" />
  <Navbar />

  <section class="container py-5">
    <div v-if="loading" class="alert alert-info">
      Lade Aufgabe...
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
      <div class="mt-3">
        <NavButton variant="secondary" to="/tasks">Zurück</NavButton>
      </div>
    </div>

    <div v-else-if="task" class="row">
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

        <p><strong>Zugewiesen an:</strong> {{ task.user }}</p>
        <p><strong>Start:</strong> {{ task.startDate }}</p>
        <p><strong>Ende:</strong> {{ task.endDate }}</p>
        <p><strong>Dauer in Stunden:</strong> {{ task.duration }} Stunden</p>

        <div class="mt-4">
          <NavButton variant="secondary" class="me-2" to="/tasks">Zurück</NavButton>
          <Button v-if="false" variant="accent">Bearbeiten</Button>
        </div>
      </div>
    </div>

    <div v-else class="text-center">
      <p>Aufgabe wurde nicht gefunden.</p>
      <NavButton variant="secondary" to="/tasks">Zurück</NavButton>
    </div>
  </section>

  <Footer />
</template>

<style scoped></style>
