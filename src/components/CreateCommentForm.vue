<script setup>
import { ref } from 'vue';

const emit = defineEmits(["submit"]);

const userName = ref("");
const text = ref("");

function submitForm() {
  if (!userName.value || !text.value) {
    alert("Bitte Name und Kommentar ausfüllen!");
    return;
  }

  emit("submit", {
    userName: userName.value,
    text: text.value
  });

  // reset
  userName.value = "";
  text.value = "";
}
</script>

<template>
  <div class="mt-4">
    <h6 class="fw-bold mb-2">Neuen Kommentar hinzufügen</h6>

    <label class="form-label">Name</label>
    <input 
      class="form-control mb-3" 
      v-model="userName"
      placeholder="Dein Name"
    />

    <label class="form-label">Kommentar</label>
    <textarea 
      class="form-control small-textarea"
      v-model="text"
      rows="3"
      placeholder="Kommentar eingeben..."
    ></textarea>

    <button 
      class="btn btn-primary mt-3"
      @click="submitForm"
    >
      Kommentar hinzufügen
    </button>
  </div>
</template>

<style scoped>
.small-textarea {
  resize: none;
  overflow-y: auto;
}
</style>
