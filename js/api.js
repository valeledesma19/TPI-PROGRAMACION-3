const BASE_URL = "https://amock.io/api/valeledesma";

const handleRes = async res => {
  if (!res.ok) {
    const text = await res.text().catch(()=>null);
    throw new Error(text || `Error ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
};

export const apiGet = async (endpoint) => {
  const res = await fetch(`${BASE_URL}/${endpoint}`);
  return handleRes(res);
};

export const apiPost = async (endpoint, data) => {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });
  return handleRes(res);
};

export const apiPut = async (endpoint, id, data) => {
  const res = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });
  return handleRes(res);
};

export const apiDelete = async (endpoint, id) => {
  const res = await fetch(`${BASE_URL}/${endpoint}/${id}`, { method: "DELETE" });
  return handleRes(res);
};