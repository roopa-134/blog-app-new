// const API_URL = "http://localhost:8000"; // Your FastAPI backend

// export async function signIn(email, password) {
//   const res = await fetch(`${API_URL}/auth/token`, {
//     method: "POST",
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body: new URLSearchParams({ username: email, password }),
//   });
//   if (!res.ok) throw new Error("Login failed");
//   return res.json();
// }

// export async function signUp(username, email, password) {
//   const res = await fetch(`${API_URL}/auth/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username, email, password }),
//   });
//   if (!res.ok) throw new Error("Registration failed");
//   return res.json();
// }
