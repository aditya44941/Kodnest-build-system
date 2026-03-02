const STORAGE_KEY = "placement_readiness_history_v1";

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export function saveAnalysisEntry(entry) {
  const history = getHistory();
  history.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getLatestEntry() {
  const history = getHistory();
  return history[0] || null;
}

export function getEntryById(id) {
  if (!id) return null;
  const history = getHistory();
  return history.find((entry) => entry.id === id) || null;
}

export function updateHistoryEntry(id, updater) {
  if (!id) return null;
  const history = getHistory();
  const index = history.findIndex((entry) => entry.id === id);
  if (index === -1) return null;

  const current = history[index];
  const updated = typeof updater === "function" ? updater(current) : { ...current, ...updater };
  history[index] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return updated;
}
