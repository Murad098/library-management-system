import api from "./api";
import { Member, MemberApiResponse } from "../types";
import { AxiosResponse } from "axios";

export const getMembers = (): Promise<AxiosResponse<MemberApiResponse[]>> =>
  api.get("/members");

export const addMember = (
  member: Pick<Member, "name" | "email" | "phone" | "fee" | "status">
): Promise<AxiosResponse<MemberApiResponse>> => api.post("/members/add", member);

export const deleteMember = (id: string) => api.delete(`/members/${id}`);
