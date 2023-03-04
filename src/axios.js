import axios from "axios"
import { refreshToken } from "./services/axios.services";

export const customFetch = axios.create({
  baseUrl: '',
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
})

// peticion
customFetch.interceptors.request.use(
  async (config) => {
    const token = getTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// respuesta
customFetch.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    console.log(error)
    const originalRequest = error.config
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      const resp = await refreshToken()

      const access_token = resp.response.accessToken;

      addTokenToLocalStorage(access_token);

      customFetch.defaults.headers.common["Authorization"] = `Bearer ${access_token}`

      return customFetch(originalRequest)
    }

    return Promise.reject(error)
  }
)