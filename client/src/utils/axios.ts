import axios from "axios";

const instance = axios.create({
    baseURL: "https://twitter-clone321.herokuapp.com/api",
});

instance.interceptors.request.use((config) => {
  config.headers!.token = localStorage.getItem("jwtToken") as string;
  return config;
}, (err) => {
  return Promise.reject(err);
})

export default instance;