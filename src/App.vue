<script setup></script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <div class="container">
        <a class="navbar-brand fw-bold text-primary" href="#">
          <img src="./assets/icons/logoImage.png" alt="Logo" style="height: 30px; margin-right: 10px;">
          Projectify Pro
        </a>
        
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <img src="./assets/icons/menue.png" alt="Menü" style="height: 24px;">
        </button>

        <div class="collapse navbar-collapse" id="mainNavbar">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li class="nav-item ms-lg-2">
              <a class="btn btn-primary" href="#">Jetzt anmelden</a>
            </li>
            <li class="nav-item ms-lg-2 d-none d-lg-block">
              <a class="btn btn-outline-primary" href="#" aria-label="Menü">
                <img src="./assets/icons/menue.png" alt="Menü" style="height: 24px; vertical-align: text-bottom;">
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <main>
    <section class="hero-section-bg">
      <div class="container content-overlap pt-5 pb-lg-5">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold">Erfolg ist das Ziel, Projectify Pro der Weg.</h1>
            <p class="lead my-4">Das moderne Werkzeug, das Ihre Projektplanung und -analyse übersichtlich und effizient bündelt.</p>
            <a href="#" class="btn btn-primary btn-lg me-2">Kostenlos starten</a>
            <a href="#" class="text-decoration-underline text-dark me-2">Erfahre mehr</a>
          </div>
          <div class="col-lg-6">
            <img src="./assets/img/arbeitsPakete.png" alt="Projektmodule" class="img-fluid rounded mb-4">
            <img src="./assets/img/projektVerlauf.png" alt="Gantt Diagramm" class="img-fluid rounded">
          </div>
        </div>
      </div>

      <div class="container content-overlap pb-5">
        <div class="row g-4 mt-4">
          <div class="col-lg-4">
            <div class="card h-100 text-center shadow border-0 p-3">
              <div class="card-body">
                <img src="./assets/icons/benutzerfreundlich.png" alt="Benutzerfreundlich" class="mb-3" style="height: 48px;">
                <h5 class="card-title mt-3">Benutzerfreundlich</h5>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card h-100 text-center shadow border-0 p-3">
              <div class="card-body">
                <img src="./assets/icons/einfachUndUebersichtlich.png" alt="Übersichtlich" class="mb-3" style="height: 48px;">
                <h5 class="card-title mt-3">Einfach & Übersichtlich</h5>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card h-100 text-center shadow border-0 p-3">
              <div class="card-body">
                <img src="./assets/icons/modern.png" alt="Modern" class="mb-3" style="height: 48px;">
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
              <p class="lead">Mit Projectify Pro organisieren Sie Ihre Projekte schnell, übersichtlich und effizient ganz ohne komplizierte Tools oder lange Excel-Tabellen.</p>
              <p class="lead">Erstellen Sie neue Projekte, planen Sie Aufgaben und behalten Sie den aktuellen Status Ihres Teams jederzeit im Blick.</p>
              <p class="lead">Dank der integrierten Zeiterfassung sehen Sie sofort, wie viel Aufwand in jede Aufgabe fließt und können Fortschritte transparent nachvollziehen.</p>
              <p class="lead">Kommentare und Notizen ermöglichen eine klare Kommunikation direkt im Projekt, ganz ohne E-Mails oder externe Chats.</p>
              <p class="lead">Die moderne Benutzeroberfläche sorgt dafür, dass Sie Projekte intuitiv per Drag and Drop verwalten können. So sparen Sie Zeit im Alltag und konzentrieren sich auf das, was wirklich zählt – Ihre Projekte erfolgreich abzuschließen.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="position-panda">
      <a href="#">
        <img src="./assets/icons/roterPanda.png" alt="Klick mich">
      </a>
    </div>
  </main>

  <footer class="bg-white text-center py-4 mt-5 border-top">
    <div class="container">
      <nav class="nav justify-content-center">
        <a class="nav-link text-muted" href="#">Datenschutz</a>
        <a class="nav-link text-muted" href="#">Impressum</a>
        <a class="nav-link text-muted" href="#">Kontakt</a>
      </nav>
      <p class="text-muted mt-2 mb-0">&copy; 2025 Projectify Pro. Alle Rechte vorbehalten.</p>
    </div>
  </footer>
</template>

<style scoped></style>