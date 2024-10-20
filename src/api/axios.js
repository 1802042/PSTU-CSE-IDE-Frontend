import axios, { isCancel } from "axios";

export default axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

export const isCanceled = (err) => axios.isCancel(err);
