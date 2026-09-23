import api from "./api";

export const getExpenses = () => api.get("/expenses");

export const addExpense = (expense) => api.post("/expenses/add", expense);

export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export const updateExpense = (id, expense) => api.put(`/expenses/${id}`, expense);
