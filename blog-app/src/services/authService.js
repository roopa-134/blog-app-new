import api from "./api";

export const signUp = (userData) => api.post("/auth/signup", userData);

export const signIn = (username, password) => {
  const form = new FormData();
  form.append("username", username);
  form.append("password", password);

  return api.post("/auth/token", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
