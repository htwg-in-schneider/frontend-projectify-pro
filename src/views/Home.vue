<script setup>
import Button from '@/components/button.vue'
import { useAuth0 } from '@auth0/auth0-vue'; 

const { loginWithRedirect } = useAuth0(); 

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <main>
    <section class="hero-section-bg">
      <div class="container content-overlap pt-5 pb-lg-5">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold">Erfolg ist das Ziel, Projectify Pro der Weg.</h1>
            <p class="lead my-4">
              Das moderne Werkzeug, das Ihre Projektplanung und -analyse übersichtlich und effizient bündelt.
            </p>

            <Button 
              @click="loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })" 
              variant="accent" 
              class="btn-lg me-2"
            >
              Kostenlos starten
            </Button>
            
            <router-link to="/kontakt" class="text-decoration-underline text-dark me-2">
              Erfahre mehr
            </router-link>
          </div>

          <div class="col-lg-6">
            <img src="@/assets/img/arbeitsPakete.png" alt="Projektmodule" class="img-fluid rounded mb-4">
            <img src="@/assets/img/projektVerlauf.png" alt="Gantt Diagramm" class="img-fluid rounded">
          </div>
        </div>
      </div>

      <div class="container content-overlap pb-5">
        <div class="row g-4 mt-4">
          <div class="col-lg-4">
            <div class="card h-100 text-center shadow border-0 p-3">
              <div class="card-body">
                <img src="@/assets/icons/benutzerfreundlich.png" alt="Benutzerfreundlich" class="mb-3" style="height: 48px;">
                <h5 class="card-title mt-3">Benutzerfreundlich</h5>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="card h-100 text-center shadow border-0 p-3">
              <div class="card-body">
                <img src="@/assets/icons/einfachUndUebersichtlich.png" alt="Übersichtlich" class="mb-3" style="height: 48px;">
                <h5 class="card-title mt-3">Einfach & Übersichtlich</h5>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="card h-100 text-center shadow border-0 p-3">
              <div class="card-body">
                <img src="@/assets/icons/modern.png" alt="Modern" class="mb-3" style="height: 48px;">
                <h5 class="card-title mt-3">Modern</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="bg-white bg-opacity-50 p-5 rounded-3 shadow content-overlap main-content-box text-black">
          <div class="row justify-content-center">
            <div class="col-lg-10">
              <p class="lead">
                Mit Projectify Pro organisieren Sie Ihre Projekte schnell, übersichtlich und effizient ganz ohne
                komplizierte Tools oder lange Excel-Tabellen.
              </p>
              <p class="lead">
                Erstellen Sie neue Projekte, planen Sie Aufgaben und behalten Sie den aktuellen Status Ihres Teams
                jederzeit im Blick.
              </p>
              <p class="lead">
                Dank der integrierten Zeiterfassung sehen Sie sofort, wie viel Aufwand in jede Aufgabe fließt und
                können Fortschritte transparent nachvollziehen.
              </p>
              <p class="lead">
                Kommentare und Notizen ermöglichen eine klare Kommunikation direkt im Projekt, ganz ohne E-Mails oder
                externe Chats.
              </p>
              <p class="lead">
                Die moderne Benutzeroberfläche sorgt dafür, dass Sie Projekte intuitiv per Drag and Drop verwalten
                können. So sparen Sie Zeit im Alltag und konzentrieren sich auf das, was wirklich zählt – Ihre Projekte
                erfolgreich abzuschließen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="position-panda" @click="scrollToTop" style="cursor: pointer;">
      <img src="@/assets/icons/roterPanda.png" alt="Nach oben scrollen">
    </div>

  </main>
</template>

<style scoped>
.position-panda {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  transition: transform 0.2s;
}

.position-panda:hover {
  transform: scale(1.1);
}
</style>