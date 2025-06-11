import axios from "axios";

export const api = axios.create({
  baseURL: "https://app.wewantwaste.co.uk/api",
  headers: {
    "Content-Type": "application/json",
  },
});