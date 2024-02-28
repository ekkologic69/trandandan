import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3090",
  timeout: 1000,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log("axios request error", error);
    return Promise.reject(error);
  },
);
export default instance;
