const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function request(path, options = {}) {
  if (!API_BASE) {
    throw new Error(
      "API 주소가 설정되지 않았습니다. .env에 VITE_API_BASE_URL을 넣어 주세요."
    );
  }
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export async function getTodos() {
  return request("");
}

export async function createTodo(title) {
  return request("", { method: "POST", body: JSON.stringify({ title }) });
}

export async function updateTodo(id, body) {
  return request(`/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}

export async function deleteTodo(id) {
  return request(`/${id}`, { method: "DELETE" });
}
