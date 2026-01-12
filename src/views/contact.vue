<script setup>
import { reactive } from 'vue';

const form = reactive({ subject: '', message: '' });

const sendEmail = () => {
  const email = 'kontakt@beispiel.de';
  const subject = encodeURIComponent(form.subject);
  const body = encodeURIComponent(form.message);
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
};
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow border-0">
          <div class="card-body p-5">
            <h2 class="mb-4">Kontaktieren Sie uns</h2>
            <form @submit.prevent="sendEmail">
              <div class="mb-3">
                <label for="subject" class="form-label">Betreff</label>
                <input v-model="form.subject" type="text" class="form-control" id="subject" required>
              </div>
              <div class="mb-3">
                <label for="message" class="form-label">Nachricht</label>
                <textarea v-model="form.message" class="form-control" id="message" rows="5" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Absenden</button>
              <router-link to="/" class="btn btn-link ms-2">Zurück zur Startseite</router-link>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>