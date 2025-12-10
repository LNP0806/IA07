import axios from "axios";

const BASE_URL = "http://mock.api.server";

export const axiosBase = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export default axiosPrivate;
