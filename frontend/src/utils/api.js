import { URL } from "./constants";

const baseHeaders = {
  "Content-Type": "application/json",
};

const getToken = () => localStorage.getItem("auth_token");

const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Token ${token}` } : {};
};

const checkResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (res.ok) return data;
  return Promise.reject(data);
};

const request = (path, options = {}) => {
  const headers = {
    ...baseHeaders,
    ...authHeader(),
    ...(options.headers || {}),
  };

  return fetch(`${URL}${path}`, { ...options, headers }).then(checkResponse);
};

// ---- Auth ----
export const registerUser = (username, password) =>
  request("/api/users/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

export const loginUser = (username, password) =>
  request("/api/token/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  }).then((data) => {
    if (data && data.auth_token) {
      localStorage.setItem("auth_token", data.auth_token);
    }
    return data;
  });

export const logoutUser = () =>
  request("/api/token/logout/", {
    method: "POST",
  }).finally(() => {
    localStorage.removeItem("auth_token");
  });

export const getUser = () => request("/api/users/me/");

// ---- Cats ----
export const getCards = () => request("/api/cats/");

export const getCard = (id) => request(`/api/cats/${id}/`);

// Создание котика (JSON, включая base64 картинку вида data:image/...;base64,...)
export const sendCard = (bodyObj) =>
  request("/api/cats/", {
    method: "POST",
    body: JSON.stringify(bodyObj),
  });

export const updateCard = (bodyObj, id) =>
  request(`/api/cats/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(bodyObj),
  });

export const deleteCard = (id) =>
  request(`/api/cats/${id}/`, {
    method: "DELETE",
  });

// ---- Achievements ----
export const getAchievements = () => request("/api/achievements/");


