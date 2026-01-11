const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Alle Projekte laden
export async function getAllProjects(token) {
  const res = await fetch(`${BASE_URL}/api/project`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Fehler beim Laden der Projekte");
  return await res.json();
}

// Neues Projekt erstellen
export async function createProject(token, projectData) {
  const res = await fetch(`${BASE_URL}/api/project`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error("Fehler beim Erstellen des Projekts");
  return await res.json();
}

// Optional: Projekt löschen (falls benötigt)
export async function deleteProject(token, id) {
  const res = await fetch(`${BASE_URL}/api/project/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Fehler beim Löschen des Projekts");
  return true;
}