const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Alle Mitarbeiter laden (für Admin-Ansicht Aufgabenblatt)
export async function getAllUsers(token) {
  const res = await fetch(`${API_BASE}/api/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!res.ok) {
    console.warn("Konnte User nicht laden");
    return [];
  }
  return await res.json();
}

// Eigenen Namen im Profil ändern
export async function updateProfileName(token, newName) {
  const res = await fetch(`${API_BASE}/api/profile/name`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name: newName })
  });

  if (!res.ok) throw new Error("Fehler beim Aktualisieren des Namens");
  return await res.json();
}