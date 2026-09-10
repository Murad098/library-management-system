import axios from 'axios';

const membersApi = axios.create({ baseURL: 'https://library-management-system-pink-eight.vercel.app/api/members' });

export const getMembers = () => membersApi.get('/');
export const addMember = (member) => membersApi.post('/add', member);
export const deleteMember = (id) => membersApi.delete(`/${id}`);