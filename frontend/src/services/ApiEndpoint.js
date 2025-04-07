import axios from "axios";
import { store } from "../redux/store";
import { SetUser } from "../redux/AuthSlice";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//Automatically attach Authorization header
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("Request sent:", config);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

//Handle expired tokens & logging
instance.interceptors.response.use(
  (response) => {
    console.log("Intercepted response:", response);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Intercepted error response:", error.response);

      if (error.response.status === 401) {
        // Token expired or invalid - Logout user
        localStorage.removeItem("token");
        store.dispatch(SetUser(null));

        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// API Methods
export const get = (url, params) => instance.get(url, { params });
export const post = (url, data) => instance.post(url, data);
export const patch = (url, data) => instance.patch(url, data);
export const deleteUser = (url) => instance.delete(url);

export default instance;
