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
