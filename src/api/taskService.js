const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// GET ALL TASKS
export async function getAllTasks(token, title = "", status = "") {
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (status) params.set("status", status);

  const res = await fetch(`${BASE_URL}/api/task?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Fehler beim Laden");
  return await res.json();
}

// ✅ NEU: Einzelne Aufgabe laden
export async function getTaskById(token, id) {
  const res = await fetch(`${BASE_URL}/api/task/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Fehler beim Laden der Aufgabe");
  return await res.json();
}

// CREATE TASK
export async function createTask(token, body) {
  const res = await fetch(`${BASE_URL}/api/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Fehler beim Erstellen");
  return await res.json();
}

export async function updateTask(token, id, body) {
  const res = await fetch(`${BASE_URL}/api/task/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Fehler beim Aktualisieren");
  return await res.json();
}

export async function deleteTask(token, id) {
  const res = await fetch(`${BASE_URL}/api/task/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Fehler beim Löschen");
  return true;
}