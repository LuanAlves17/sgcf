export function clearStorage() {
  if (typeof window === "undefined") return;
  localStorage.clear();
  sessionStorage.clear();
}
