const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Alle Mitarbeiter laden
export async function getAllUsers(token) {
  const res = await fetch(`${API_BASE}/api/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!res.ok) {
    console.warn("Konnte User nicht laden (Backend Endpunkt /api/users fehlt evtl?)");
    return [];
  }
  return await res.json();
}