<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <div class="container py-5">
    <div class="card shadow border-0">
      <div class="card-body p-5">
        <h1 class="mb-4">Impressum</h1>

        <h2 class="h5 mt-4">Angaben gemäß § 5 TMG</h2>
        
        <p>
          <strong>Projectify Pro</strong><br>
          Alfred-Wachtel-Str. 8<br>
          78462 Konstanz
        </p>

        <p>
          <strong>Vertreten durch:</strong><br>
          Katarina Stevanovic<br>
          Julian Hartwig
        </p>

        <h2 class="h5 mt-4">Kontakt</h2>
        <p>
          Telefon: +49 (0) 123_BitteNichtAnrufen<br>
          E-Mail: kontakt@projectify-pro.de
        </p>

        <h2 class="h5 mt-4">Haftung für Inhalte</h2>
        <p class="small text-muted">
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        </p>

        <h2 class="h5 mt-4">Haftung für Links</h2>
        <p class="small text-muted">
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
        </p>

        <h2 class="h5 mt-4">Urheberrecht</h2>
        <p class="small text-muted">
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
        </p>

        <div class="mt-5">
          <router-link to="/" class="btn btn-outline-primary">Zurück zur Startseite</router-link>
        </div>
      </div>
    </div>
  </div>
</template>