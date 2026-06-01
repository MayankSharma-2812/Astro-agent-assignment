// generate or retrieve a persistent session ID
export function getSessionId() {
  let id = localStorage.getItem("astro_session_id");
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("astro_session_id", id);
  }
  return id;
}
