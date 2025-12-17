import { URL } from "./constants";

const checkResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (res.ok) return data;
  return Promise.reject(data);
};

const baseHeaders = {
  "Content-Type": "application/json",
};

const getToken = () => localStorage.getItem("auth_token");


const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Token ${token}` } : {};
};


const request = (path, options = {}) => {
  const headers = {
    ...baseHeaders,
    ...(options.headers || {}),
    ...authHeader(),
  };

  return fetch(`${URL}${path}`, {
    ...options,
    headers,
  }).then(checkResponse);
};

export const loginUser = async ({ username, password }) => {
  const data = await request("/api/token/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  const token = data.auth_token || data.token;
  if (!token) {
    return Promise.reject({ detail: "Token was not returned by server." });
  }

  localStorage.setItem("auth_token", token);
  return data;
};

export const logoutUser = async () => {

  const data = await request("/api/token/logout/", { method: "POST" });
  localStorage.removeItem("auth_token");
  return data;
};

export const getUser = () => request("/api/users/me/");

export const getCards = (page = 1) => request(`/api/cats/?page=${page}`);

export const getCard = (id) => request(`/api/cats/${id}/`);

export const addCard = (formData) => {

  const token = getToken();
  const headers = token ? { Authorization: `Token ${token}` } : {};

  return fetch(`${URL}/api/cats/`, {
    method: "POST",
    headers,
    body: formData,
  }).then(checkResponse);
};

export const updateCard = (id, bodyObj) =>
  request(`/api/cats/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(bodyObj),
  });

export const deleteCard = (id) =>
  request(`/api/cats/${id}/`, {
    method: "DELETE",
  });


export const getAchievements = () => request("/api/achievements/");

export const addAchievement = (bodyObj) =>
  request("/api/achievements/", {
    method: "POST",
    body: JSON.stringify(bodyObj),
  });

export const deleteAchievement = (id) =>
  request(`/api/achievements/${id}/`, {
    method: "DELETE",
  });

