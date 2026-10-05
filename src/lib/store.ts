import type {
  AnyRequest,
  CustomEventRequest,
  RequestStatus,
  TicketRequest,
  LocationItem,
} from "../types";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "ucwestpark:admin-token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export class ApiError extends Error {}

async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(
      "Couldn't reach the server. Check your connection and that the API is running."
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (res.status === 401 && !path.startsWith("/auth/login")) {
      clearToken();
      throw new ApiError("Your session has expired. Please log in again.");
    }
    throw new ApiError(body.error || `Request failed (${res.status}).`);
  }

  if (res.status === 204) return null;
  return res.json();
}

function jsonBody(data: unknown): RequestInit {
  return { headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) };
}

/* ---------------------------------- Auth --------------------------------- */

export async function login(username: string, password: string): Promise<void> {
  const result = await apiFetch("/auth/login", { method: "POST", ...jsonBody({ username, password }) });
  setToken(result.token);
}

export function logout() {
  clearToken();
}

/* ------------------------------- Locations ------------------------------- */

export async function getLocations(): Promise<LocationItem[]> {
  return apiFetch("/locations");
}

export async function addLocation(data: Omit<LocationItem, "id">): Promise<LocationItem> {
  return apiFetch("/locations", { method: "POST", ...jsonBody(data) });
}

export async function updateLocation(id: string, patch: Partial<LocationItem>): Promise<LocationItem> {
  return apiFetch(`/locations/${encodeURIComponent(id)}`, { method: "PUT", ...jsonBody(patch) });
}

export async function deleteLocation(id: string): Promise<void> {
  await apiFetch(`/locations/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function uploadLocationImage(file: File): Promise<string> {
  const token = getToken();
  const form = new FormData(); form.append("file", file);
  const res = await fetch(`${API_URL}/uploads`, { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: form });
  if (!res.ok) { const body = await res.json().catch(() => ({})); throw new ApiError(body.error || "Image upload failed."); }
  return (await res.json()).url;
}

/* ------------------------------- Categories ------------------------------ */

export async function getCategories(): Promise<string[]> {
  return apiFetch("/categories");
}

export async function addCategory(name: string): Promise<void> {
  await apiFetch("/categories", { method: "POST", ...jsonBody({ name }) });
}

export async function deleteCategory(name: string): Promise<void> {
  await apiFetch(`/categories/${encodeURIComponent(name)}`, { method: "DELETE" });
}

/* --------------------------------- Requests ------------------------------- */


export async function saveContactMessage(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  website?: string;
}): Promise<void> {
  await apiFetch("/contact", { method: "POST", ...jsonBody(data) });
}

export async function saveTicketRequest(
  data: Omit<TicketRequest, "id" | "status" | "createdAt" | "kind"> & { website?: string }
): Promise<TicketRequest> {
  return apiFetch("/ticket-requests", { method: "POST", ...jsonBody(data) });
}

export async function saveCustomEventRequest(
  data: Omit<CustomEventRequest, "id" | "status" | "createdAt" | "kind"> & { website?: string }
): Promise<CustomEventRequest> {
  return apiFetch("/event-requests", { method: "POST", ...jsonBody(data) });
}

export async function getAllRequests(): Promise<AnyRequest[]> {
  const requests = await apiFetch("/requests");
  return requests.filter((request: AnyRequest) => request.kind !== "custom-event");
}

export async function updateRequestStatus(
  kind: "ticket" | "custom-event" | "contact",
  id: string,
  status: RequestStatus
): Promise<AnyRequest> {
  return apiFetch(`/requests/${kind}/${id}`, {
    method: "PATCH",
    ...jsonBody({ status }),
  });
}
