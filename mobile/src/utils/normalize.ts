import { Member, MemberApiResponse, Expense, ExpenseApiResponse } from "../types";

export const normalizeMember = (member: MemberApiResponse): Member => ({
  id: member._id,
  name: member.name || "",
  email: member.email || "",
  phone: member.phone || "",
  fee: Number(member.fee) || 0,
  status: member.status === "paid" ? "paid" : "unpaid",
  createdAt: member.createdAt || null,
});

export const normalizeExpense = (expense: ExpenseApiResponse): Expense => ({
  id: expense._id,
  title: expense.title || "",
  amount: Number(expense.amount) || 0,
  category: expense.category || "Other",
  date: expense.date || null,
});
