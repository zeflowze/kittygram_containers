import { URL } from "./constants";

const JSON_HEADERS = { "Content-Type": "application/json" };

// В разных версиях проекта токен могли хранить под разными ключами.
// Поддерживаем оба, чтобы у всех всё работало.
const TOKEN_KEYS = ["auth_token", "token"];

const getToken = () => {
  for (const key of TOKEN_KEYS) {
    const t = localStorage.getItem(key);
    if (t && t !== "undefined" && t !== "null") return t;
  }
  return null;
};

const setToken = (token) => {
  TOKEN_KEYS.forEach((k) => localStorage.setItem(k, token));
};

const clearToken = () => {
  TOKEN_KEYS.forEach((k) => localStorage.removeItem(k));
};

const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Token ${token}` } : {};
};

// Чтобы не уйти в бесконечные reload при каком-то другом баге
let reloadedAfter401 = false;

const handle401 = () => {
  clearToken();

  // Если пользователь был на странице, которая требует авторизации,
  // самый надёжный UX — перезагрузка: приложение покажет форму входа.
  if (!reloadedAfter401) {
    reloadedAfter401 = true;
    window.location.reload();
  }
};

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

const checkResponse = async (res) => {
  if (res.status === 401) {
    handle401();
  }

  const data = await safeJson(res);
  if (res.ok) return data;

  return Promise.reject(data);
};

const request = (path, options = {}) => {
  const headers = {
    ...JSON_HEADERS,
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
    if (data?.auth_token) {
      setToken(data.auth_token);
      return data;
    }
    clearToken();
    return data;
  });

export const logoutUser = () =>
  request("/api/token/logout/", { method: "POST" }).finally(() => {
    clearToken();
  });

export const getUser = () => request("/api/users/me/");

// ---- Cats ----
export const getCards = () => request("/api/cats/");

export const getCard = (id) => request(`/api/cats/${id}/`);

// Создание котика: JSON + base64 изображение (data:image/...;base64,...)
export const sendCard = (bodyObj) =>
  request("/api/cats/", {
    method: "POST",
    body: JSON.stringify(bodyObj),
  });

// алиас (если где-то в коде использовалось старое имя)
export const addCard = sendCard;

export const updateCard = (bodyObj, id) =>
  request(`/api/cats/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(bodyObj),
  });

export const deleteCard = (id) =>
  request(`/api/cats/${id}/`, { method: "DELETE" });

// ---- Achievements ----
export const getAchievements = () => request("/api/achievements/");


