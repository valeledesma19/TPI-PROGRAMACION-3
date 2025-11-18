const BASE_A = "https://691b234b2d8d78557571af8e.mockapi.io";


const BASE_B = "https://691b28782d8d78557571c5f3.mockapi.io";

const handleRes = async res => {
  if (!res.ok) {
    const text = await res.text().catch(()=>null);
    throw new Error(text || `Error ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
};

const selectBase = (endpoint) =>
  endpoint === "enrollments" ? BASE_B : BASE_A;

export const apiGet = async (endpoint) => {
  const base = selectBase(endpoint);
  const res = await fetch(`${base}/${endpoint}`);
  return handleRes(res);
};

export const apiPost = async (endpoint, data) => {
  const base = selectBase(endpoint);
  const res = await fetch(`${base}/${endpoint}`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });
  return handleRes(res);
};

export const apiPut = async (endpoint, id, data) => {
  const base = selectBase(endpoint);
  const res = await fetch(`${base}/${endpoint}/${id}`, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });
  return handleRes(res);
};

export const apiDelete = async (endpoint, id) => {
  const base = selectBase(endpoint);
  const res = await fetch(`${base}/${endpoint}/${id}`, { method: "DELETE" });
  return handleRes(res);
};