const BASE_URL = 'http://localhost:8081/api/task';

export async function getAllTasks() {
  const res = await fetch(BASE_URL);
  return await res.json();
}

export async function getTask(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return await res.json();
}

export async function createTask(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.ok;
}

export async function updateTask(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.ok;
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}
