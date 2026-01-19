<script setup>
import { reactive } from 'vue';

const form = reactive({ 
  firstName: '', 
  lastName: '', 
  email: '', 
  subject: '', 
  message: '' 
});

const sendEmail = () => {
  const emailReceiver = 'projectify.pro@web.de';
  const subject = encodeURIComponent(form.subject);
  
  // E-Mail-Body mit allen Formular-Daten zusammenstellen
  const bodyContent = `
Vorname: ${form.firstName}
Name: ${form.lastName}
E-Mail: ${form.email}

Nachricht:
${form.message}
  `.trim();
  
  const body = encodeURIComponent(bodyContent);
  window.location.href = `mailto:${emailReceiver}?subject=${subject}&body=${body}`;
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
              
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="firstName" class="form-label">Vorname</label>
                  <input v-model="form.firstName" type="text" class="form-control" id="firstName">
                </div>
                <div class="col-md-6">
                  <label for="lastName" class="form-label">Name</label>
                  <input v-model="form.lastName" type="text" class="form-control" id="lastName">
                </div>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">E-Mailadresse *</label>
                <input v-model="form.email" type="email" class="form-control" id="email" required>
              </div>

              <div class="mb-3">
                <label for="subject" class="form-label">Betreff *</label>
                <input v-model="form.subject" type="text" class="form-control" id="subject" required>
              </div>

              <div class="mb-3">
                <label for="message" class="form-label">Nachricht *</label>
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