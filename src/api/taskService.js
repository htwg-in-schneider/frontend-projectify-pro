
const BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllTasks(title = "", status = "") {
  const params = new URLSearchParams();
  if (title) params.append("title", title);
  if (status) params.append("status", status);

  const res = await fetch(`${BASE_URL}/api/task?${params.toString()}`);
  if (!res.ok) throw new Error("Fehler beim Laden");
  return await res.json();
}

export async function getTask(id) {
  const res = await fetch(`${BASE_URL}/api/task/${id}`);
  if (!res.ok) throw new Error("Fehler beim Laden");
  return await res.json();
}

export async function createTask(body) {
  const res = await fetch(`${BASE_URL}/api/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Fehler beim Erstellen");
  return await res.json();
}

export async function updateTask(id, body) {
  const res = await fetch(`${BASE_URL}/api/task/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Fehler beim Aktualisieren");
  return await res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/api/task/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Fehler beim Löschen");
  return true;
}
