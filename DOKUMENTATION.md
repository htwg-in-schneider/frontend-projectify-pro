# Projectify Pro – Projektdokumentation

**Projekt:** Projectify Pro  
**Team:** Julian Hartwig, Katarina Stevanović  
**Modul:** Web-Technologien (WIN)  
**Technologien:** Vue.js 3, Spring Boot, Auth0, GitHub Pages, Render, MariaDB

---

## a) Spezifikation und Design

### Ziel der Applikation
Projectify Pro ist eine webbasierte Projektmanagement-Applikation für kleine Unternehmen, Agenturen und Freelancer. Ziel ist es, Projekte, Aufgaben und Arbeitszeiten zentral zu verwalten und daraus transparente Übersichten sowie abrechenbare Rechnungen zu generieren. Die Anwendung ersetzt mehrere Insellösungen (z. B. Excel, einzelne To-do-Tools) durch eine einheitliche Plattform.

### Projektziele
- Projekte und Aufgaben effizient planen, priorisieren und überwachen.
- Arbeitszeiten transparent erfassen und mit Projektbudgets verknüpfen.
- Den administrativen Aufwand durch automatisierte Auswertungen und Rechnungen reduzieren.
- Eine rollenbasierte, sichere Nutzung für verschiedene Benutzergruppen ermöglichen.

---

### Personas

**Persona 1: Sarah Fischer – Agenturinhaberin (KMU)**  
Sarah führt eine wachsende Digitalagentur mit mehreren parallelen Kundenprojekten.  
Sie benötigt eine zentrale Übersicht über Projektfortschritte, Budgets und Mitarbeitereinsatz, um fundierte Entscheidungen treffen zu können.  
Ihr Hauptproblem sind verteilte Tools und fehlende Transparenz über den wirtschaftlichen Erfolg einzelner Projekte.

**Persona 2: Peter Klecks – Freelancer**  
Peter arbeitet als selbstständiger Webentwickler für mehrere Kunden gleichzeitig.  
Er möchte seinen administrativen Aufwand minimieren und Rechnungen direkt aus seinen erfassten Arbeitszeiten erstellen.  
Ihm fehlt eine einfache Lösung, um Aufgaben, Zeiten und Abrechnung strukturiert zu verbinden.

---

### Use-Case-Übersicht
Die Applikation unterstützt folgende zentrale Use Cases:

- Benutzer anmelden / logout
- Dashboard einsehen
- Projekt erstellen
- Aufgaben erstellen, bearbeiten und löschen
- Aufgabenstatus aktualisieren
- Aufgaben kommentieren
- Suche und Filter für Aufgaben
- Benutzerverwaltung (Admin)
- Rechnung generieren


---

### Design
Das visuelle Design folgt einem modernen, klaren und professionellen Stil.

- **Moodboard:** Fokus auf Produktivität, Übersicht und Datenvisualisierung
- **Style Tile:**  
  - Schriftart: Montserrat  
  - Farbpalette: Blau- und Violetttöne  
  - Gestaltung: klar, modern, benutzerfreundlich
- **Responsive Design:** Optimiert für Desktop und mobile Endgeräte
- **HiFi-Mockups:** Erstellt in Figma und als Grundlage für die Umsetzung verwendet

---

## b) Implementierung

### Benutzer anmelden / logout
Die Authentifizierung erfolgt über Auth0.  
Benutzer melden sich entweder über GitHub oder über einen Auth0-Account an.  
Nach erfolgreichem Login wird der Benutzer anhand seiner Rolle (ADMIN oder REGULAR) autorisiert und erhält Zugriff auf die entsprechenden Funktionen.  
Der Logout beendet die Sitzung und entfernt die Authentifizierungsdaten im Frontend.

---

### Dashboard einsehen
Nach dem Login wird ein Dashboard angezeigt, das Aufgaben nach Status (z. B. „Offen“, „In Bearbeitung“, „Review“, „Erledigt“) strukturiert darstellt.  
Die Ansicht ist rollenabhängig und bietet Projektleitern und Administratoren zusätzliche Übersichten.

---

### Projekt erstellen
Projektleiter und Administratoren können neue Projekte anlegen.  
Dabei werden grundlegende Projektdaten erfasst und gespeichert.  
Nach dem Erstellen erscheint das Projekt in der Projektübersicht und kann mit Aufgaben befüllt werden.

---

### Aufgaben erstellen
Innerhalb eines Projekts können Aufgaben angelegt werden.  
Eine Aufgabe enthält u. a. Titel, Beschreibung, Status, zuständigen Benutzer und abrechnungsrelevante Informationen.  
Die Aufgabe wird direkt dem Projekt zugeordnet und im Dashboard angezeigt.

---

### Aufgaben bearbeiten und löschen
Bestehende Aufgaben können aktualisiert oder gelöscht werden.  
Änderungen werden sofort gespeichert und im Frontend aktualisiert dargestellt.

---

### Aufgabenstatus aktualisieren
Der Status einer Aufgabe kann über ein Dropdown geändert werden (z. B. von „In Bearbeitung“ zu „Review“ oder „Erledigt“).  
Dies dient der transparenten Fortschrittsverfolgung im Projekt.

---

### Aufgaben kommentieren
Benutzer können Aufgaben kommentieren, um Fortschritte, Rückfragen oder Probleme zu dokumentieren.  
Kommentare werden chronologisch gespeichert und angezeigt.

---

### Suche und Filter
Aufgaben können nach Titel gesucht und nach Status gefiltert werden.  
Die Filterung erfolgt serverseitig über entsprechende API-Endpunkte.

---

### Benutzerverwaltung (Admin)
Administratoren können Benutzer einsehen und deren Stammdaten bearbeiten (z. B. Name, E-Mail, Rolle).  
Das Anlegen neuer Benutzer erfolgt extern über Auth0.

---

### Rechnung generieren
Für abgeschlossene Aufgaben kann eine Rechnung generiert werden.  
Die Berechnung basiert auf den erfassten Arbeitszeiten und hinterlegten Stundensätzen.  
Die Rechnung wird als Übersicht dargestellt und dient als Grundlage für die Abrechnung.

---

## c) Bereitstellung

### URLs
- **Frontend (GitHub Pages):**  
  https://htwg-in-schneider.github.io/frontend-projectify-pro/

- **Backend (Render):**  
  https://backend-projectify-pro.onrender.com

---

### Testzugänge

**Admin**
- E-Mail: goofy@projectify.local  
- Passwort: Testgoofy1!  
- Login: Auth0

**Regular User**
- E-Mail: moritz@projectify.local
- Passwort: Testmoritz1!  
- Login: Auth0

---

## d) Optimierung

### SEO (Suchmaschinenoptimierung)

- **Semantische Struktur:**  
  Anstelle von rein generischen Container-Elementen (`div`) werden semantische HTML5-Elemente wie `<header>`, `<main>` und `<footer>` eingesetzt. Dadurch wird die Struktur der Anwendung für Suchmaschinen klarer und besser interpretierbar.

- **Responsive Meta-Tags:**  
Durch korrekt gesetzte Viewport-Meta-Tags passt sich die Anwendung an unterschiedliche Bildschirmgrößen an. Der Schwerpunkt der Benutzeroberfläche liegt dabei auf der Desktop-Darstellung, da die Anwendung primär für die Nutzung am Computer konzipiert ist. Dies stellt eine übersichtliche und strukturierte Darstellung komplexerer Inhalte sicher.

- **Sprechende Seitentitel:**  
  Die einzelnen Ansichten (z. B. Aufgabenübersicht oder Benutzerverwaltung) besitzen aussagekräftige Seitentitel, die den jeweiligen Inhalt der Seite eindeutig widerspiegeln.

---

### Performance Tuning

- **Reduzierung von HTTP-Anfragen:**  
  Durch die komponentenbasierte Architektur von Vue.js werden mehrere UI-Bestandteile gebündelt geladen, wodurch die Anzahl der notwendigen HTTP-Anfragen beim initialen Seitenaufbau reduziert wird.

- **Effiziente CSS-Nutzung:**  
  Die Verwendung des Bootstrap-Frameworks ermöglicht ein performantes Rendering durch optimierte und wiederverwendbare CSS-Klassen, ohne zusätzlichen, redundanten Styling-Code.

- **Code-Bereinigung:**  
  Vor der Abgabe wurden Debug-Ausgaben (z. B. `console.log`) entfernt sowie nicht genutzte Beispiel- und Testdateien gelöscht, um die Anwendung schlank und wartbar zu halten.

- **Asynchrone Backend-Kommunikation:**  
  Die Kommunikation mit dem Spring-Boot-Backend erfolgt vollständig asynchron. Dadurch bleibt die Benutzeroberfläche auch während laufender Datenabfragen reaktionsfähig (Non-blocking UI).

  ### Hard Coding
  Die Stundensätze für die Rechnungserstellung sind Hard gecoded und jeweils für 100€ pro Stunde festgelegt.
