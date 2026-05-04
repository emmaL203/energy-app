const API_URL = "https://energy-app-8yvb.onrender.com";

export { API_URL };

// REGISTER
export const registerUser = async (email, password) => {
  const res = await fetch(
    `${API_URL}/register?email=${email}&password=${password}`,
    { method: "POST" }
  );
  return res.json();
};

// LOGIN
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: email,
      password: password,
    }),
  });
  return res.json();
};

// CONSUMPTIONS
export const getConsumptions = async (token) => {
  const res = await fetch(`${API_URL}/consumptions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

// ADD
export const addConsumption = async (token, data) => {
  const res = await fetch(
    `${API_URL}/add-consumption?valoare=${data.valoare}&tip=${data.tip}&data=${data.data}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.json();
};