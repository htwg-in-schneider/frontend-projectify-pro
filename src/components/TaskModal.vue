<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  show: Boolean,
  title: String
});

const emit = defineEmits(["close"]);

/* 
  Hintergrundklick soll schließen,
  aber Klick IM MODAL soll NICHT schließen.
*/
function onBackdropClick(event) {
  if (event.target === event.currentTarget) {
    emit("close");
  }
}
</script>

<template>
  <div 
    v-if="show" 
    class="modal-backdrop"
    @click="onBackdropClick"
  >
    <div class="modal-container">

      <!-- Header -->
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <slot />
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <slot name="footer" />
      </div>

    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.modal-container {
  width: 95%;
  max-width: 600px;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

.modal-body {
  overflow-y: auto;
  flex: 1;
  padding-top: 12px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
}
</style>
