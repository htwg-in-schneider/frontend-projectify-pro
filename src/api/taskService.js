import { useAuth0 } from '@auth0/auth0-vue';

const BASE_URL = import.meta.env.VITE_API_URL;

/* ================= GET ALL TASKS ================= */
export async function getAllTasks(title = "", status = "") {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();

  const params = new URLSearchParams();
  if (title) params.append("title", title);
  if (status) params.append("status", status);

  const res = await fetch(`${BASE_URL}/api/task?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Fehler beim Laden");
  }

  return await res.json();
}

/* ================= GET SINGLE TASK ================= */
export async function getTask(id) {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();

  const res = await fetch(`${BASE_URL}/api/task/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Fehler beim Laden");
  }

  return await res.json();
}

/* ================= CREATE TASK (ADMIN) ================= */
export async function createTask(body) {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();

  const res = await fetch(`${BASE_URL}/api/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Fehler beim Erstellen");
  }

  return await res.json();
}

/* ================= UPDATE TASK (ADMIN) ================= */
export async function updateTask(id, body) {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();

  const res = await fetch(`${BASE_URL}/api/task/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Fehler beim Aktualisieren");
  }

  return await res.json();
}

/* ================= DELETE TASK (ADMIN) ================= */
export async function deleteTask(id) {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();

  const res = await fetch(`${BASE_URL}/api/task/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Fehler beim Löschen");
  }

  return true;
}
