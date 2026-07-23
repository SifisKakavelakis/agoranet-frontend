import api from './axios';

export const loginApi = async (credential: string, password: string) => {
    const { data } = await api.post('/auth/login', { credential, password });
    return data;
};

export const registerApi = async (payload: {
    username:  string;
    password:  string;
    email:     string;
    firstname: string;
    lastname:  string;
}) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
};