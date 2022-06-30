import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8000/",
});

instance.interceptors.request.use((config) => {
  config.headers!.token = localStorage.getItem("jwtToken") as string;
  return config;
}, (err) => {
  return Promise.reject(err);
})

export default instance;