import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const http = axios.create({ baseURL: API });

export const STAGES = [
  "New", 
  "Quote Draft", 
  "Quote Sent", 
  "Quote Accepted", 
  "Quote Rejected",
  "Visit Scheduled", 
  "In Progress", 
  "Completed", 
  "Lost"
];
export const SOURCES = ["phone", "website", "email", "text", "referral", "other"];
export const EQUIPMENT_TYPES = ["walk-in-cooler", "freezer", "ice-machine", "other"];

export const getCallToday = () => http.get("/call-today").then((r) => r.data);
export const getJobs = (stage) =>
  http.get("/jobs", { params: stage ? { stage } : {} }).then((r) => r.data);
export const getJob = (id) => http.get(`/jobs/${id}`).then((r) => r.data);
export const getCounts = () => http.get("/jobs/counts").then((r) => r.data);
export const getDashboard = () => http.get("/dashboard").then((r) => r.data);
export const createJob = (payload) => http.post("/jobs", payload).then((r) => r.data);
export const updateJob = (id, payload) => http.patch(`/jobs/${id}`, payload).then((r) => r.data);
export const setStage = (id, stage) =>
  http.patch(`/jobs/${id}/stage`, { stage }).then((r) => r.data);
export const logContact = (id, kind, detail = "") =>
  http.post(`/jobs/${id}/contact`, { kind, detail }).then((r) => r.data);
export const parseMessage = (text) => http.post("/parse", { text }).then((r) => r.data);
export const deleteJob = (id) => http.delete(`/jobs/${id}`).then((r) => r.data);

// Quote
export const createQuote = (id, payload) => http.post(`/jobs/${id}/quote`, payload).then((r) => r.data);
export const updateQuote = (id, payload) => http.patch(`/jobs/${id}/quote`, payload).then((r) => r.data);
export const sendQuote = (id) => http.post(`/jobs/${id}/quote/send`).then((r) => r.data);
export const acceptQuote = (id) => http.post(`/jobs/${id}/quote/accept`).then((r) => r.data);
export const rejectQuote = (id) => http.post(`/jobs/${id}/quote/reject`).then((r) => r.data);

// Visit
export const createVisit = (id, payload) => http.post(`/jobs/${id}/visit`, payload).then((r) => r.data);
export const updateVisit = (id, payload) => http.patch(`/jobs/${id}/visit`, payload).then((r) => r.data);

// Completion
export const startJob = (id) => http.post(`/jobs/${id}/start`).then((r) => r.data);
export const completeJob = (id, payload) => http.post(`/jobs/${id}/complete`, payload).then((r) => r.data);


export function waitLabel(days) {
  if (days <= 0) return "today";
  if (days === 1) return "1 day";
  return `${days} days`;
}
