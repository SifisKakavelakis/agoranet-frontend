import api from './axios';

export const getUserByUsernameApi = async (username: string) => {
    const { data } = await api.get(`/users/${username}`);
    return data;
};

export const updateUserApi = async (username: string, payload: {
    firstname?:   string;
    lastname?:    string;
    email?:       string;
    phoneNumber?: string;
    avatarUrl?:   string;
    password?:    string;
}) => {
    const { data } = await api.put(`/users/${username}`, payload);
    return data;
};

export const becomeSellerApi = async () => {
    const { data } = await api.post('/users/become-seller');
    return data;
};