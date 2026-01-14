<script setup>
import { ref, onMounted } from 'vue';
import CreateCommentForm from '@/components/CreateCommentForm.vue';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const props = defineProps({
  taskId: {
    type: Number,
    required: true
  }
});

const comments = ref([]);
const loading = ref(true);

async function loadComments() {
  try {
    const res = await fetch(`${BASE_URL}/api/comment/task/${props.taskId}`);
    comments.value = await res.json();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

onMounted(loadComments);

async function saveComment(data) {
  try {
    const res = await fetch(`${BASE_URL}/api/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: data.userName,
        text: data.text,
        task: { id: props.taskId }
      })
    });

    if (!res.ok) {
      alert("Fehler beim Speichern des Kommentars");
      return;
    }

    loadComments();
  } catch (e) {
    console.error(e);
  }
}
</script>


<template>
  <div class="mt-4">

    <h5 class="fw-bold mb-3">Kommentare</h5>

    <!-- loading -->
    <div v-if="loading" class="text-muted">Kommentare werden geladen...</div>

    <!-- no comments -->
    <div v-else-if="comments.length === 0" class="text-muted mb-3">
      Keine Kommentare vorhanden.
    </div>

    <!-- commend list -->
    <ul v-else class="list-group mb-3">
      <li
        v-for="c in comments"
        :key="c.id"
        class="list-group-item"
      >
        <strong>{{ c.userName }}</strong><br />
        <span>{{ c.text }}</span>
      </li>
    </ul>

    <!-- form for new comments -->
    <CreateCommentForm @submit="saveComment" />
  </div>
</template>

<style scoped>
.list-group-item {
  border-radius: 6px;
  margin-bottom: 6px;
  background: #f8f9fa;
}
</style>
