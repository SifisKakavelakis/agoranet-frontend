import api from './axios';

export const getSellerReviewsApi = async (username: string) => {
    const { data } = await api.get(`/reviews/seller/${username}`);
    return data;
};

export const createReviewApi = async (payload: {
    orderId:  number;
    rating:   number;
    comment?: string;
}) => {
    const { data } = await api.post('/reviews', payload);
    return data;
};