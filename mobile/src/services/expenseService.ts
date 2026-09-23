import api from "./api";
import { Expense, ExpenseApiResponse } from "../types";
import { AxiosResponse } from "axios";

export const getExpenses = (): Promise<AxiosResponse<ExpenseApiResponse[]>> =>
  api.get("/expenses");

export const addExpense = (
  expense: Pick<Expense, "title" | "amount" | "category" | "date">
): Promise<AxiosResponse<ExpenseApiResponse>> =>
  api.post("/expenses/add", expense);

export const deleteExpense = (id: string) => api.delete(`/expenses/${id}`);

export const updateExpense = (
  id: string,
  expense: Pick<Expense, "title" | "amount" | "category" | "date">
) => api.put(`/expenses/${id}`, expense);
