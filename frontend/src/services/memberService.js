import api from "./api";

export const getMembers = () => api.get("/members");

export const addMember = (member) => api.post("/members/add", member);

export const deleteMember = (id) => api.delete(`/members/${id}`);

export const updateMember = (id, member) => api.put(`/members/${id}`, member);
