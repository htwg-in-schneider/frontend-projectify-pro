const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAllTasks(token, title = "", status = "") {
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (status) params.set("status", status);

  const res = await fetch(`${BASE_URL}/api/task?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Fehler beim Laden der Aufgaben");
  return await res.json();
}

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
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Fehler beim Löschen");
  return true;
}

// Einzelne Aufgabe laden (für Edit Form)
export async function getTaskById(token, id) {
  const res = await fetch(`${BASE_URL}/api/task/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Fehler beim Laden der Aufgabe");
  return await res.json();
}

// Kommentare zu einer Aufgabe laden
export async function getComments(token, taskId) {
  // Falls das Backend 404 zurückgibt
  const res = await fetch(`${BASE_URL}/api/comment/task/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return []; 
  return await res.json();
}

// Kommentar hinzufügen
export async function addComment(token, commentData) {
  const res = await fetch(`${BASE_URL}/api/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(commentData),
  });
  if (!res.ok) throw new Error("Fehler beim Speichern des Kommentars");
  return await res.json();
}