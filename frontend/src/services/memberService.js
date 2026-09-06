import axios from 'axios';

const membersApi = axios.create({ baseURL: 'http://localhost:5000/api/members' });

export const getMembers = () => membersApi.get('/all');
export const addMember = (member) => membersApi.post('/add', member);
export const deleteMember = (id) => membersApi.delete(`/${id}`);